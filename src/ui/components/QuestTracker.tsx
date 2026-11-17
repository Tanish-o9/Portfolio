import React, { useState } from 'react';
import { useGameStore, QuestId } from '../../state/gameStore';
import { Target, CheckCircle2, Circle, ChevronDown, ChevronUp, Trophy, Sparkles } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';

interface QuestDef {
  id: QuestId;
  title: string;
  desc: string;
  placeId: string;
}

const QUEST_DEFS: QuestDef[] = [
  {
    id: 'quantora_sim',
    title: 'Optimize QUANTORA VRAM',
    desc: 'Simulate INT4 NF4 quantization in Project Street.',
    placeId: 'project-quantora',
  },
  {
    id: 'tanish_ai',
    title: 'Ask Tanish AI Companion',
    desc: 'Chat with the AI assistant in the lower-right or Town Square.',
    placeId: 'tanish-ai-npc',
  },
  {
    id: 'college_leetcode',
    title: 'Inspect AKGEC LeetCode',
    desc: 'Review 100+ LeetCode problems solved at College.',
    placeId: 'college',
  },
  {
    id: 'workshop_terminal',
    title: 'Run Workshop Terminal',
    desc: 'Type a CLI command like "benchmarks" in GitHub Workshop.',
    placeId: 'workshop-sign',
  },
  {
    id: 'guestbook_sign',
    title: 'Visit Town Guestbook',
    desc: 'View or sign the public visitor guestbook.',
    placeId: 'guestbook-stand',
  },
];

export const QuestTracker: React.FC = () => {
  const { quests, isQuestTrackerOpen, setQuestTrackerOpen, openPanel } = useGameStore();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const completedCount = QUEST_DEFS.filter((q) => quests[q.id]).length;
  const isAllComplete = completedCount === QUEST_DEFS.length;

  if (isAllComplete && !hasCelebrated) {
    setHasCelebrated(true);
    soundEffects.playQuestSuccess();
  }

  const handleToggle = () => {
    soundEffects.playClick();
    setQuestTrackerOpen(!isQuestTrackerOpen);
  };

  const handleQuestClick = (quest: QuestDef) => {
    soundEffects.playClick();
    if (quest.id === 'tanish_ai') {
      openPanel('ai-chat');
    } else if (quest.id === 'quantora_sim') {
      openPanel('project', 'quantora');
    } else if (quest.id === 'college_leetcode') {
      openPanel('education');
    } else if (quest.id === 'workshop_terminal') {
      openPanel('terminal');
    } else if (quest.id === 'guestbook_sign') {
      openPanel('guestbook');
    }
  };

  return (
    <div className="fixed top-16 left-4 z-20 pointer-events-auto">
      {/* Compact Trigger Button */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-3.5 py-2 bg-[#FFF6E3] hover:bg-white border-2 border-[#3A2A1E] rounded-2xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] transition-all active:translate-y-0.5 active:shadow-none"
      >
        {isAllComplete ? (
          <Trophy className="w-4 h-4 text-[#F6B73C] animate-bounce" />
        ) : (
          <Target className="w-4 h-4 text-[#E0674A]" />
        )}
        <span>Quests ({completedCount}/{QUEST_DEFS.length})</span>
        {isQuestTrackerOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-[#3A2A1E]/70" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-[#3A2A1E]/70" />
        )}
      </button>

      {/* Expanded Quest Menu */}
      {isQuestTrackerOpen && (
        <div className="mt-2 w-72 sm:w-80 bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl p-4 shadow-[0_6px_0_#3A2A1E] text-[#4A382B] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#3A2A1E]/20 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F6B73C]" />
              <h4 className="text-sm font-extrabold text-[#3A2A1E]">Village Explorer Quests</h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#266F73]">
              {Math.round((completedCount / QUEST_DEFS.length) * 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-white border border-[#3A2A1E]/30 rounded-full overflow-hidden p-0.5 mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#4F8CFF] via-[#F6B73C] to-[#10B981] rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / QUEST_DEFS.length) * 100}%` }}
            />
          </div>

          {/* Quest items list */}
          <div className="space-y-2">
            {QUEST_DEFS.map((q) => {
              const done = quests[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => handleQuestClick(q)}
                  className={`p-2 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-90'
                      : 'bg-white border-[#3A2A1E]/20 hover:border-[#3A2A1E] hover:bg-[#FFF]'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#3A2A1E]/40 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold leading-tight ${done ? 'line-through text-emerald-800' : 'text-[#3A2A1E]'}`}>
                      {q.title}
                    </div>
                    <div className="text-[10px] text-[#4A382B]/80 truncate">
                      {q.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isAllComplete && (
            <div className="mt-3 p-2.5 bg-[#F6B73C]/20 border-2 border-[#F6B73C] rounded-xl text-center">
              <span className="text-xs font-extrabold text-[#3A2A1E] flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F6B73C]" />
                All Quests Complete! Master AI Engineer
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};