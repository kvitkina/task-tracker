import { memo, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'low' | 'medium' | 'high' | 'default';
  className?: string;
}

export const Badge = memo(function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border';
  
  const variants = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    default: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
});
