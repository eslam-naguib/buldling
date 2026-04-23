import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
}

export default function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-danger-container text-danger",
    warning: "bg-amber-100 text-amber-800",
    outline: "text-text-main border border-border",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
