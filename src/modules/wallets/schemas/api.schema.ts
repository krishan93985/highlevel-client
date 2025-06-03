import { z } from 'zod';
import { 
  walletResponseSchema, 
  setupWalletResponseSchema, 
  transactionResponseSchema, 
  transactionsResponseSchema 
} from './wallet.schema';
import { apiResponseSchema } from '../../../common/types/api.types';

// Specific API Response Types
export const walletApiResponseSchema = apiResponseSchema(walletResponseSchema);
export const setupWalletApiResponseSchema = apiResponseSchema(setupWalletResponseSchema);
export const transactionApiResponseSchema = apiResponseSchema(transactionResponseSchema);
export const transactionsApiResponseSchema = apiResponseSchema(transactionsResponseSchema);

// Type exports
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<z.ZodType<T>>>>;
export type WalletApiResponse = z.infer<typeof walletApiResponseSchema>;
export type SetupWalletApiResponse = z.infer<typeof setupWalletApiResponseSchema>;
export type TransactionApiResponse = z.infer<typeof transactionApiResponseSchema>;
export type TransactionsApiResponse = z.infer<typeof transactionsApiResponseSchema>; 