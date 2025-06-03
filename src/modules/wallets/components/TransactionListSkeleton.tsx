import React from 'react';
import { ShimmerText } from '../../../common/components/Shimmer';

export const TransactionListSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ShimmerText className="w-48 mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="space-y-2">
              <ShimmerText className="w-32" />
              <ShimmerText className="w-24" />
            </div>
            <ShimmerText className="w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}; 