import React, { useEffect, Suspense, lazy } from 'react';
import { useGameStore } from '../state/gameStore';
import { LoadingScreen } from '../ui/components/LoadingScreen';

const VillageView = lazy(() =>
  import('../ui/VillageView').then((m) => ({ default: m.VillageView }))
);
const ClassicPortfolio = lazy(() =>
  import('../classic/ClassicPortfolio').then((m) => ({ default: m.ClassicPortfolio }))
);

export const App: React.FC = () => {
  const { mode, setMode } = useGameStore();

  useEffect(() => {
    // Check path on load
    const path = window.location.pathname;
    if (path === '/classic') {
      setMode('classic');
    }

    const handlePopState = () => {
      if (window.location.pathname === '/classic') {
        setMode('classic');
      } else {
        setMode('village');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setMode]);

  useEffect(() => {
    // Sync browser URL with store mode
    const currentPath = window.location.pathname;
    if (mode === 'classic' && currentPath !== '/classic') {
      window.history.pushState(null, '', '/classic');
    } else if (mode === 'village' && currentPath === '/classic') {
      window.history.pushState(null, '', '/');
    }
  }, [mode]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      {mode === 'classic' ? <ClassicPortfolio /> : <VillageView />}
    </Suspense>
  );
};

export default App;
