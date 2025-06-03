import { Link } from 'react-router-dom';
import { useWallet } from '../../../modules/wallets/hooks/useWallet';

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children }) => {
  const { walletId } = useWallet();
  const isTransactionsLink = to === '/transactions';

  // Disable transactions link if no wallet is selected
  if (isTransactionsLink && !walletId) {
    return (
      <span className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-400 cursor-not-allowed">
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
    >
      {children}
    </Link>
  );
}; 