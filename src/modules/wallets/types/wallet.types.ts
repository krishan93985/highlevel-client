import type { z } from 'zod';
import type {
  walletSchema,
  transactionSchema,
  walletResponseSchema,
  setupWalletResponseSchema,
  transactionResponseSchema,
  transactionsResponseSchema,
  baseTransactionSchema
} from '../schemas/wallet.schema';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum SortField {
  DATE = 'date',
  AMOUNT = 'amount'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Request Types
export type WalletInput = z.infer<typeof walletSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;

// Response Types
export type Wallet = z.infer<typeof walletResponseSchema>;
export type SetupWalletResponse = z.infer<typeof setupWalletResponseSchema>;
export type Transaction = z.infer<typeof transactionResponseSchema>;
export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>;
export type BaseTransaction = z.infer<typeof baseTransactionSchema>; 