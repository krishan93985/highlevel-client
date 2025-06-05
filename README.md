# Wallet Application

A modern React application for managing digital wallets and transactions with robust error handling, form validation, and optimized performance.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Form Management](#form-management)
- [API Integration](#api-integration)
- [Error Handling](#error-handling)
- [Performance Optimizations](#performance-optimizations)

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

```
src/
├── common/               # Shared utilities, components, and hooks
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and service layer
│   └── utils/          # Utility functions
├── modules/             # Feature-based organization
│   ├── wallets/        # Wallet management module
└── pages/              # Route components
    ├── wallet/        # wallet route
    ├── transactions/  # transactions route
```

## Features

### Wallet Management
- Create and manage digital wallets
- Real-time balance updates
- Transaction history with sorting and filtering
- Wallet selection and context management
- Persistent wallet sessions using localStorage

Example of wallet dashboard component:
```typescript
export const WalletDashboard: React.FC = () => {
  const { wallet, isLoading, error } = useWallet();

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {isLoading ? <WalletBalanceSkeleton /> : <WalletBalance wallet={wallet} />}
      <WalletTransactionForm />
    </div>
  );
};
```

Example of wallet persistence:
```typescript
export const useWalletState = () => {
  // Initialize wallet ID from localStorage
  const [walletId, setWalletIdState] = useState<string | null>(() => 
    localStorage.getItem(WALLET_STORAGE_KEY)
  );

  const setWalletId = useCallback(async (id: string) => {
    setWalletIdState(id);
    // Persist wallet ID to localStorage
    localStorage.setItem(WALLET_STORAGE_KEY, id);
    const success = await loadWallet(id);
    if (!success) {
      clearWallet();
    }
  }, [loadWallet]);

  const clearWallet = useCallback(() => {
    setWalletIdState(null);
    // Clear wallet data from localStorage on logout/errors
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);
};
```

### Transactions
- Create new transactions (deposit/withdrawal)
- Transaction type selection with visual feedback
- Amount validation with minimum balance checks
- Transaction history with pagination
- Export functionality

## Tech Stack

### Frontend Framework & Core
- **React** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server

### Routing & State Management
- **React Router v6** - Client-side routing
- **React Context** - Global state management

### Form Management & Validation
- **React Hook Form** - Form state management and validation
- **@hookform/resolvers** - Form validation resolvers
- **Zod** - Schema validation and type inference

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications

### HTTP Client & API
- **Axios** - HTTP client
- **AbortController** - Request cancellation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript ESLint** - TypeScript-specific linting

## Form Management

### React Hook Form Integration

Example of transaction form implementation:
```typescript
export const WalletTransactionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: MIN_BALANCE,
      description: '',
      type: TransactionType.CREDIT
    }
  });

  const onSubmit = async (data: TransactionInput) => {
    const finalAmount = data.type === TransactionType.DEBIT ? -data.amount : data.amount;
    await walletService.transact(walletId, finalAmount, data.description);
  };
};
```

### Validation Schemas
Using Zod for type-safe schema validation:
```typescript
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
```

### API Call Optimization
- Request cancellation on unmount
- Pagination with load more button
- Sort and filter state management

## Technical Considerations and Caveats

1. **Error Handling**
   - Global error boundary for React errors
   - Structured API error handling with error codes
   - Form validation errors with user feedback
   - Toast notifications for success/error states

   ```typescript
   // Global Error Boundary
   export class ErrorBoundary extends Component<Props, State> {
     public static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     public render() {
       if (this.state.hasError) {
         return (
           <div className="min-h-[400px] flex items-center justify-center">
             <div className="text-center p-8">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">
                 Something went wrong
               </h2>
               <p className="text-gray-600 mb-6">
                 {this.state.error?.message || 'An unexpected error occurred'}
               </p>
               <Button onClick={this.handleReset}>Try Again</Button>
             </div>
           </div>
         );
       }
       return this.props.children;
     }
   }

   // Structured API Error Handling
   export const handleApiError = (error: any): void => {
     if (error?.response?.data?.error?.code) {
       const code = error.response.data.error.code as ErrorCode;
       const mapping = ERROR_MAPPINGS[code];
       
       if (mapping) {
         if (code === ERROR_MAPPINGS.VALIDATION_ERROR.code && error.response?.data?.message) {
           toast.error(error.response.data.message);
           return;
         }
         toast[mapping.toastType](mapping.message);
         return;
       }
     }
     toast.error('An unexpected error occurred. Please try again.');
   };
   ```

2. **Loading States**
   - Skeleton loaders for initial page load
   - Loading overlays for operations
   - Disabled states during form submission
   - Progress indicators for long operations

   ```typescript
   // Skeleton Loading Component
   export const TransactionListSkeleton: React.FC = () => (
     <div className="space-y-4">
       {[...Array(3)].map((_, index) => (
         <div key={index} className="flex items-center justify-between py-3">
           <ShimmerText className="w-32" />
           <ShimmerText className="w-24" />
         </div>
       ))}
     </div>
   );

   // Loading State Management in Hooks
   const [isLoading, setIsLoading] = useState(true);
   const loadWallet = useCallback(async (id: string) => {
     setIsLoading(true);
     try {
       const walletData = await walletService.getWallet(id);
       setWallet(walletData);
     } finally {
       setIsLoading(false);
     }
   }, []);
   ```

3. **Memory Management**
   - Cleanup of event listeners
   - API call abortion on unmount
   - Proper disposal of subscriptions
   - Clear interval/timeout cleanup

   ```typescript
   // API Call Cleanup
   export const useApiPagination = <T>({ fetchFn, limit }: Props<T>) => {
     const abortControllerRef = useRef<AbortController | null>(null);

     const loadPage = useCallback(async (pageNum: number) => {
       if (abortControllerRef.current) {
         abortControllerRef.current.abort();
       }
       abortControllerRef.current = new AbortController();
       const signal = abortControllerRef.current.signal;
       // ... fetch logic
     }, [fetchFn, limit]);

     useEffect(() => {
       return () => {
         if (abortControllerRef.current) {
           abortControllerRef.current.abort();
         }
       };
     }, []);
   };
   ```

4. **Form Optimizations**
   - Debounced form submissions
   - Field-level validation
   - Dynamic form fields
   - Type-safe form handling

   ```typescript
   // Debounced Form Submission
   export const useDebouncedSubmit = <T extends FieldValues>(
     handleSubmit: UseFormHandleSubmit<T>,
     onSubmit: (data: T) => Promise<void>,
     wait: number = DEBOUNCE_TIME
   ) => {
     const debouncedSubmit = useRef(
       debounce(handleSubmit(onSubmit), wait)
     ).current;

     useEffect(() => {
       return () => debouncedSubmit.cancel();
     }, [debouncedSubmit]);

     return debouncedSubmit;
   };
   ```

5. **API Integration**
   - Response transformers
   - Error handling

   ```typescript
   // Response Validation and Error Handling
   private async validateResponse<T>(response: T, schema: z.ZodSchema): Promise<T> {
     try {
       return schema.parse(response);
     } catch (error) {
       if (error instanceof z.ZodError) {
         const validationError = new ValidationError('Response validation failed', error);
         handleApiError(validationError);
         throw validationError;
       }
       throw error;
     }
   }
   ```

6. **Security**
   - Input sanitization

7. **State Management**
   - Context optimization
   - Props drilling prevention
   - State colocation
   - Atomic updates

   ```typescript
   // Wallet State Management with Context
   export const useWalletState = () => {
     const [walletId, setWalletIdState] = useState<string | null>(() => 
       localStorage.getItem(WALLET_STORAGE_KEY)
     );
     const [wallet, setWallet] = useState<Wallet | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const setWalletId = useCallback(async (id: string) => {
       setWalletIdState(id);
       localStorage.setItem(WALLET_STORAGE_KEY, id);
       const success = await loadWallet(id);
       if (!success) {
         clearWallet();
       }
     }, [loadWallet]);

     return {
       state: { walletId, wallet, isLoading, error },
       actions: { setWalletId, clearWallet }
     };
   };
   ```

8. **UI/UX Considerations**
   - Responsive design
   - Loading feedback
   - Error states
   - Success confirmations
