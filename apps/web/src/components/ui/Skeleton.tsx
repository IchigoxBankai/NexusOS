import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'rounded' | 'circular';
}

export function Skeleton({
  className,
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variants = {
    rectangular: 'rounded-none',
    rounded: 'rounded-2xl',
    circular: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/70',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

