import React from 'react';
import { SortField, SortOrder } from '../types/wallet.types';

interface SortOption {
  label: string;
  field: SortField;
}

const sortOptions: SortOption[] = [
  { label: 'Date', field: SortField.DATE },
  { label: 'Amount', field: SortField.AMOUNT },
];

interface TransactionSortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const TransactionSort: React.FC<TransactionSortProps> = ({
  sortField,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        value={sortField}
        onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
        className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {sortOptions.map((option) => (
          <option key={option.field} value={option.field}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          onSortChange(
            sortField,
            sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
          )
        }
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {sortOrder === SortOrder.ASC ? '↑ Ascending' : '↓ Descending'}
      </button>
    </div>
  );
}; 