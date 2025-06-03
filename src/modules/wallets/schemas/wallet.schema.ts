import { z } from 'zod';
import { TransactionType } from '../types/wallet.types';
import { MIN_BALANCE } from '../constants/wallet.constants';

// Base Schemas
export const baseWalletSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  balance: z.number(),
  date: z.string().datetime().optional(),
});

export const baseTransactionSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  amount: z.number(),
  description: z.string(),
  balance: z.number(),
  date: z.string().datetime(),
  type: z.nativeEnum(TransactionType),
});

// Request Validation Schemas
export const walletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required'),
  balance: z.number().nonnegative().optional(),
});

export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Please enter a valid amount'
    })
    .min(MIN_BALANCE, `Amount must be at least ${MIN_BALANCE}`),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters'),
  type: z.nativeEnum(TransactionType)
});

// Response Validation Schemas
export const walletResponseSchema = baseWalletSchema;

export const setupWalletResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  transactionId: z.string(),
  date: z.string().datetime(),
});

export const transactionResponseSchema = z.object({
  balance: z.number(),
  transactionId: z.string(),
});

export const paginationMetadataSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
});

export const transactionsResponseSchema = z.object({
  items: z.array(baseTransactionSchema),
  metadata: paginationMetadataSchema,
}); 