import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'subcard' | 'ghost';
}

export function Card({ className, variant = 'glass', children, ...props }: CardProps) {
  const variants = {
    glass:
      'bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_8px_30px_rgb(112,128,176,0.08)] rounded-3xl',
    elevated:
      'bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-[0_12px_40px_rgb(112,128,176,0.12)] rounded-3xl',
    subcard:
      'bg-white/95 border border-slate-100/90 shadow-[0_2px_10px_-2px_rgba(90,105,143,0.06)] rounded-2xl hover:border-slate-200 transition-all duration-150',
    ghost:
      'bg-transparent border border-transparent',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between p-5 pb-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-slate-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-500 font-normal', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
