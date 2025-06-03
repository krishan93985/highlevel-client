import React from 'react';
import { ShimmerText } from '../../../common/components/Shimmer';

export const WalletBalanceSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <ShimmerText className="w-48 mb-4" />
      <ShimmerText className="w-32 h-8" />
    </div>
  );
}; 