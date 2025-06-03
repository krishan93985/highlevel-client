import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletPage } from './pages/wallet';
import { TransactionsPage } from './pages/transactions';
import { ErrorBoundary } from './common/components/ErrorBoundary';
import walletLogo from './assets/wallet-logo.svg';
import { Navigation } from './common/components/navigation/Navigation';
import { NAVIGATION_LINKS } from './common/constants/ui.constants';
function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col bg-gray-100">
        <Navigation
          logo={{ src: walletLogo, alt: 'Wallet Logo' }}
          title="Wallet App"
          links={NAVIGATION_LINKS}
        />

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

export default App;
