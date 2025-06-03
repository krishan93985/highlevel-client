import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './modules/wallets/context/WalletContext';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            className: 'bg-green-50 text-green-600 border border-green-200',
          },
          error: {
            className: 'bg-red-50 text-red-600 border border-red-200',
            duration: 5000,
          },
        }}
      />
    </WalletProvider>
  </React.StrictMode>
);
