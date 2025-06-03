import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../modules/wallets/hooks/useWallet';
import { TransactionTable } from '../modules/wallets/components/TransactionTable';

export const TransactionsPage: React.FC = () => {
  const { walletId } = useWallet();

  if (!walletId) {
    return <Navigate to="/wallet" replace />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Transaction History</h2>
      <TransactionTable />
    </div>
  );
}; 