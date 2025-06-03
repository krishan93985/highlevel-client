import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '../hooks/useWallet';
import { Button } from '../../../common/components/Button';
import { walletService } from '../services/wallet.service';
import { walletSchema } from '../schemas/wallet.schema';
import type { WalletInput } from '../types/wallet.types';
import { MIN_BALANCE } from '../constants/wallet.constants';
import { useDebouncedSubmit } from '../../../common/hooks/useDebouncedSubmit';

export const WalletSetupForm: React.FC = () => {
  const { setWalletId } = useWallet();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<WalletInput>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: '',
      balance: 0
    },
    mode: 'onChange',
    delayError: 500,
    shouldFocusError: false
  });

  const onSubmit = useCallback(async (data: WalletInput) => {
    try {
      const response = await walletService.setup(data);
      setWalletId(response.id, response);
    } catch (err) {
      console.error('Failed to create wallet:', err);
      throw new Error('Failed to create wallet. Please try again.');
    }
  }, [setWalletId]);

  const debouncedOnSubmit = useDebouncedSubmit(handleSubmit, onSubmit);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedOnSubmit();
  };

  return (
    <form noValidate onSubmit={handleFormSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          id="name"
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="Enter wallet name"
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
          Initial Balance (optional)
        </label>
        <input
          type="number"
          id="balance"
          min="0"
          step={MIN_BALANCE}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.balance ? 'border-red-500' : 'border-gray-300'
          } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="0"
          {...register('balance', { 
            setValueAs: (value) => value === '' ? 0 : Number(value),
            valueAsNumber: true 
          })}
        />
        {errors.balance && (
          <p className="mt-1 text-sm text-red-600">{errors.balance.message}</p>
        )}
      </div>

      <Button 
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Wallet'}
      </Button>
    </form>
  );
};
