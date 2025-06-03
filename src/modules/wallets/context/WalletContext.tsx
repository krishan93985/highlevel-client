import React, { createContext } from 'react';
import { useWalletState } from '../hooks/useWalletState';
import type { WalletState } from '../hooks/useWalletState';
import type { Wallet } from '../types/wallet.types';

type WalletContextValue = WalletState & {
  setWalletId: (id: string, walletData?: Wallet) => Promise<void>;
  clearWallet: () => void;
};

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, actions } = useWalletState();

  return (
    <WalletContext.Provider 
      value={{
        ...state,
        setWalletId: actions.setWalletId,
        clearWallet: actions.clearWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 