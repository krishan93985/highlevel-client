import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useWallet } from './modules/wallets/hooks/useWallet';
import { WalletPage } from './pages/wallet';
import { TransactionsPage } from './pages/transactions';
import { ErrorBoundary } from './common/components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Wallet App</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink to="/wallet">Wallet</NavLink>
                  <NavLink to="/transactions">Transactions</NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/" element={<Navigate to="/wallet" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const { walletId } = useWallet();
  const isTransactionsLink = to === '/transactions';

  // Disable transactions link if no wallet is selected
  if (isTransactionsLink && !walletId) {
    return (
      <span className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-400 cursor-not-allowed">
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-600"
    >
      {children}
    </Link>
  );
};

export default App;
