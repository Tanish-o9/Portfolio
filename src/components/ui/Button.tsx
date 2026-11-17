import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'compact' | 'icon';
  asLink?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  asLink = false,
  href,
  target,
  rel,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none rounded-btn select-none';

  const sizeClasses = {
    default: 'h-12 px-6 text-[15px] min-h-[44px]',
    compact: 'h-10 px-4 text-sm min-h-[44px]',
    icon: 'w-10 h-10 min-w-[44px] min-h-[44px] p-2',
  }[size];

  const variantClasses = {
    primary:
      'bg-accent text-[#06101F] font-semibold hover:bg-accent-hover shadow-[0_2px_12px_rgba(79,140,255,0.25)] active:scale-[0.98]',
    secondary:
      'border border-secondary-border bg-secondary-btn text-text hover:border-accent hover:bg-card active:scale-[0.98]',
    ghost:
      'text-text-body hover:text-text hover:bg-card/50',
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (asLink && href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
