import { memo, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = memo(function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10',
    secondary: 'bg-surface hover:bg-surface/80 border border-border text-text',
    danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20',
    ghost: 'hover:bg-surface/50 text-muted hover:text-text',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
