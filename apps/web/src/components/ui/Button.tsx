import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:bg-slate-950',
      secondary:
        'bg-surface-pill text-slate-800 hover:bg-surface-pill-hover border border-slate-200/60 shadow-pill',
      outline:
        'border border-slate-200 bg-white/70 text-slate-700 hover:bg-white hover:border-slate-300 backdrop-blur-sm',
      ghost:
        'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60',
      pill:
        'rounded-full bg-[#F1F3F8] text-[#1E2530] hover:bg-[#E5E9F2] text-xs px-3.5 py-1.5 font-medium shadow-sm transition-all',
      danger:
        'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-xl gap-1.5',
      md: 'text-sm px-4 py-2 rounded-2xl gap-2',
      lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-2xl items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'pill' && sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
