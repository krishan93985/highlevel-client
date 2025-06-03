import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '../hooks/useWallet';
import { Button } from '../../../common/components/Button';
import { walletService } from '../services/wallet.service';
import { transactionSchema } from '../schemas/wallet.schema';
import { TransactionType, type TransactionInput } from '../types/wallet.types';
import { TransactionTypeButton } from './TransactionTypeButton';
import { MIN_BALANCE } from '../constants/wallet.constants';
import { useDebouncedSubmit } from '../../../common/hooks/useDebouncedSubmit';

interface WalletTransactionFormProps {
  onSuccess?: () => void;
}

export const WalletTransactionForm: React.FC<WalletTransactionFormProps> = ({ onSuccess }) => {
  const { walletId } = useWallet();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: MIN_BALANCE,
      description: '',
      type: TransactionType.CREDIT
    },
    mode: 'onChange',
    delayError: 500,
    shouldFocusError: false
  });

  const currentType = watch('type');

  const onSubmit = useCallback(async (data: TransactionInput) => {
    if (!walletId) return;
    
    try {
      const finalAmount = data.type === TransactionType.DEBIT ? -data.amount : data.amount;
      await walletService.transact(walletId, finalAmount, data.description);
      
      reset();
      onSuccess?.();
    } catch (err) {
      throw new Error('Transaction failed. Please try again.');
    }
  }, [walletId, reset, onSuccess]);

  const debouncedSubmit = useDebouncedSubmit(handleSubmit, onSubmit);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSubmit();
  };

  const handleTypeChange = (newType: TransactionType) => {
    if (!isSubmitting) {
      setValue('type', newType, { shouldValidate: true });
    }
  };

  return (
    <form noValidate onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex space-x-4 mb-4">
        {[TransactionType.CREDIT, TransactionType.DEBIT].map((type) => (
          <TransactionTypeButton
            key={type}
            type={type}
            selected={currentType === type}
            onClick={() => handleTypeChange(type)}
          />
        ))}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          step={MIN_BALANCE}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder={MIN_BALANCE.toString()}
          {...register('amount', { 
            valueAsNumber: true
          })}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="Enter transaction description"
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <input type="hidden" {...register('type')} />

      <Button
        type="submit"
        disabled={isSubmitting}
        variant={currentType === TransactionType.CREDIT ? 'primary' : 'outline'}
        className={currentType === TransactionType.DEBIT ? 'border-red-600 text-red-600 hover:bg-red-50' : ''}
      >
        {isSubmitting ? 'Processing...' : `Add ${currentType.toLowerCase()}`}
      </Button>
    </form>
  );
};
