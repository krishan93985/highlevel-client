import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { walletService } from '../services/wallet.service';
import { useApiPagination } from '../../../common/hooks/useApiPagination';
import type { BaseTransaction } from '../types/wallet.types';
import { ITEMS_PER_PAGE } from '../../../common/constants/ui.constants';
import { SortField, SortOrder } from '../types/wallet.types';
import { TransactionSort } from './TransactionSort';
import { TransactionListSkeleton } from './TransactionListSkeleton';
import { ExportTransactionsButton } from './ExportTransactionsButton';

export const TransactionTable: React.FC = () => {
  const { walletId } = useWallet();
  const [sortField, setSortField] = useState<SortField>(SortField.DATE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const {
    items: transactions,
    isLoading,
    error,
    hasMore,
    loadMore,
  } = useApiPagination<BaseTransaction>({
    fetchFn: async (page, limit, signal) => {
      if (!walletId) return [];
      const skip = (page - 1) * limit;
      const response = await walletService.getTransactions(
        walletId,
        skip,
        limit,
        sortField,
        sortOrder,
        signal
      );
      return response.items;
    },
    limit: ITEMS_PER_PAGE,
    enabled: Boolean(walletId),
    dependencies: [sortField, sortOrder] // Refresh when sort options change
  });

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
        Failed to load transactions. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TransactionSort
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        <ExportTransactionsButton
          sortBy={sortField}
          sortOrder={sortOrder}
        />
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {transaction.balance.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && <TransactionListSkeleton />}

        {hasMore && !isLoading && (
          <div className="py-4 text-center">
            <button
              onClick={() => loadMore()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-white hover:bg-gray-50"
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && transactions.length > 0 && (
          <div className="py-4 text-center text-gray-500 text-sm">
            No more transactions to load.
          </div>
        )}

        {!isLoading && transactions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}; 