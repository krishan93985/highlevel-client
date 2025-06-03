import { Link } from 'react-router-dom';
import { useWallet } from '../../../modules/wallets/hooks/useWallet';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const { walletId } = useWallet();
  const isTransactionsLink = to === '/transactions';

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