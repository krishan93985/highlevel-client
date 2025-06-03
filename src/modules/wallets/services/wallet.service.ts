import { api } from '../../../common/services/api.service';
import {
  type WalletInput,
  SortField,
  SortOrder,
} from '../types/wallet.types';
import {
  setupWalletResponseSchema,
  walletResponseSchema,
  transactionResponseSchema,
  transactionsResponseSchema,
} from '../schemas/wallet.schema';
import type { SetupWalletApiResponse, TransactionApiResponse, TransactionsApiResponse, WalletApiResponse } from '../schemas/api.schema';

export const walletService = {
  setup: async (data: WalletInput): Promise<SetupWalletApiResponse['data']> => {
    const response = await api.post<SetupWalletApiResponse['data']>('/setup', data, setupWalletResponseSchema);
    return response.data;
  },

  getWallet: async (id: string): Promise<WalletApiResponse['data']> => {
    const response = await api.get<WalletApiResponse['data']>(`/wallet/${id}`, undefined, walletResponseSchema);
    return response.data;
  },

  transact: async (
    walletId: string,
    amount: number,
    description: string
  ): Promise<TransactionApiResponse['data']> => {
    const response = await api.post<TransactionApiResponse['data']>(
      `/transact/${walletId}`,
      { amount, description },
      transactionResponseSchema
    );
    return response.data;
  },

  getTransactions: async (
    walletId: string,
    skip = 0,
    limit = 10,
    sortBy: SortField = SortField.DATE,
    sortOrder: SortOrder = SortOrder.DESC,
    signal?: AbortSignal
  ): Promise<TransactionsApiResponse['data']> => {
    const response = await api.get<TransactionsApiResponse['data']>(
      '/transactions',
      { walletId, skip, limit, sortBy, sortOrder },
      transactionsResponseSchema,
      { signal }
    );
    return response.data;
  },

  exportTransactions: async (
    walletId: string,
    options?: {
      sortBy?: SortField;
      sortOrder?: SortOrder;
    }
  ): Promise<Blob> => {
    const response = await api.get<Blob>(
      '/transactions/export',
      { 
        walletId,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      },
      undefined,
      { 
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      }
    );
    return response as unknown as Blob;
  },
}; 