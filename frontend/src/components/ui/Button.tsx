import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-md";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "bg-surface-container text-text-main hover:bg-surface-container-high border border-border",
    danger: "bg-danger text-white hover:bg-red-700",
    success: "bg-success text-white hover:bg-emerald-600",
    outline: "border border-primary text-primary hover:bg-surface-container-low",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
