import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { WalletTransactionForm } from './WalletTransactionForm';
import { WalletBalanceSkeleton } from './WalletBalanceSkeleton';
import { WalletTransactionFormSkeleton } from './WalletTransactionFormSkeleton';

export const WalletDashboard: React.FC = () => {
  const { wallet, isLoading, error, setWalletId, walletId } = useWallet();

  const handleTransactionSuccess = async () => {
    if (!walletId) return;
    // Refresh wallet data after successful transaction
    await setWalletId(walletId);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {isLoading || !wallet ? (
        <WalletBalanceSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{wallet.name}</h2>
          <div className="text-4xl font-semibold text-green-600">
            ${wallet.balance.toFixed(4)}
          </div>
        </div>
      )}

      {isLoading ? (
        <WalletTransactionFormSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">New Transaction</h3>
          <WalletTransactionForm onSuccess={handleTransactionSuccess} />
        </div>
      )}
    </div>
  );
}; 