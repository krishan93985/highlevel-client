import React from 'react';
import { useWallet } from '../modules/wallets/hooks/useWallet';
import { WalletSetupForm } from '../modules/wallets/components/WalletSetupForm';
import { WalletDashboard } from '../modules/wallets/components/WalletDashboard';

export const WalletPage: React.FC = () => {
  const { walletId, error } = useWallet();

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1 h-[calc(100vh-12rem)]">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!walletId) {
    return (
      <div className="flex items-center justify-center flex-1 h-[calc(100vh-12rem)]">
        <WalletSetupForm />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WalletDashboard />
    </div>
  );
}; 