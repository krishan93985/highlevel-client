import { useState } from 'react';
import { NavLink } from './NavLink';
import { MobileNavLink } from './MobileNavLink';
import { MobileMenuButton } from './MobileMenuButton';

interface NavigationProps {
  logo: {
    src: string;
    alt: string;
  };
  title: string;
  links: Array<{
    to: string;
    label: string;
  }>;
}

export const Navigation: React.FC<NavigationProps> = ({ logo, title, links }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <img src={logo.src} alt={logo.alt} className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <MobileNavLink key={link.to} to={link.to}>
                {link.label}
              </MobileNavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}; 