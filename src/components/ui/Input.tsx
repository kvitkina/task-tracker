import { memo, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, className = '', ...props },
    ref
  ) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-background border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
          } rounded-md text-sm text-text placeholder-muted/50 focus:outline-none transition-colors ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  })
);
