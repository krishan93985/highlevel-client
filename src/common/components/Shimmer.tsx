import React from 'react';
import { cn } from '../utils/styles.utils';

interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      {...props}
    />
  );
};

export const ShimmerText: React.FC<ShimmerProps> = ({ className = '' }) => {
  return <Shimmer className={`h-4 rounded ${className}`} />;
};

export const ShimmerBlock: React.FC<ShimmerProps> = ({ className = '' }) => {
  return <Shimmer className={`rounded-lg ${className}`} />;
}; 