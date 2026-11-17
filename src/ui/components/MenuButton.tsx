import React from 'react';

export interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const bgClass = variant === 'primary' ? 'bg-[#F6B73C] hover:bg-[#ffc652]' : 'bg-[#FFF6E3] hover:bg-white';
  return (
    <button
      className={`px-4 py-2 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] font-bold text-sm text-[#3A2A1E] active:translate-y-0.5 active:shadow-none transition-all ${bgClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
