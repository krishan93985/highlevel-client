import { useState, useCallback, useEffect } from 'react';
import { walletService } from '../services/wallet.service';
import type { Wallet } from '../types/wallet.types';
import { WALLET_STORAGE_KEY } from '../constants/wallet.constants';

export interface WalletState {
  walletId: string | null;
  wallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
}

export const useWalletState = () => {
  const [walletId, setWalletIdState] = useState<string | null>(() => 
    localStorage.getItem(WALLET_STORAGE_KEY)
  );
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const walletData = await walletService.getWallet(id);
      setWallet(walletData);
      return true;
    } catch (err) {
      console.error('Failed to load wallet:', err);
      setError('Failed to load wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setWalletId = useCallback(async (id: string) => {
    setWalletIdState(id);
    localStorage.setItem(WALLET_STORAGE_KEY, id);
    const success = await loadWallet(id);
    if (!success) {
      // If initial load fails, clear the stored wallet ID
      clearWallet();
    }
  }, [loadWallet]);

  const clearWallet = useCallback(() => {
    setWalletIdState(null);
    setWallet(null);
    setError(null);
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);

  // Load initial wallet data if walletId exists in localStorage
  useEffect(() => {
    if (walletId) {
      loadWallet(walletId).then(success => {
        if (!success) {
          // If initial load fails, clear the stored wallet ID
          clearWallet();
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    state: { walletId, wallet, isLoading, error },
    actions: { setWalletId, clearWallet }
  };
}; 