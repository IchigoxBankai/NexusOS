import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  statusOnline?: boolean;
}

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  showStatus = false,
  statusOnline = true,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n?: string | null) => {
    if (!n) return 'N';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden font-semibold border border-white/60 shadow-sm select-none',
          sizes[size],
          !src || hasError ? 'bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700' : 'bg-slate-100',
          className
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name || 'User avatar'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            statusOnline ? 'bg-emerald-500' : 'bg-slate-300'
          )}
        />
      )}
    </div>
  );
}

