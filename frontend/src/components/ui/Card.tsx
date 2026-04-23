import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-surface border border-border/50 rounded-lg shadow-subtle overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
