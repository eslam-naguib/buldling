import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-1.5 text-text-main">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-transparent bg-surface-container-low px-3 py-2 text-sm text-text-main transition-colors",
            "focus-visible:outline-none focus-visible:bg-surface focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-text-muted",
            error && "border-danger focus-visible:border-danger focus-visible:ring-danger",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-semibold text-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
