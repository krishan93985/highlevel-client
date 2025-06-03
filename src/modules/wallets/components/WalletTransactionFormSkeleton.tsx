import React from 'react';
import { ShimmerBlock, ShimmerText } from '../../../common/components/Shimmer';

export const WalletTransactionFormSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <ShimmerText className="w-40 mb-6" />
      <div className="space-y-4">
        <ShimmerText className="w-full" />
        <ShimmerText className="w-3/4" />
        <ShimmerBlock className="w-full h-10 mt-6" />
      </div>
    </div>
  );
}; 