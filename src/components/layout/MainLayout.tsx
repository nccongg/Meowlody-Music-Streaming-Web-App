import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import Footer from '../Layouts/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-black/30 backdrop-blur-lg text-white hover:bg-white/10 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300`}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[var(--sidebar-width-collapsed)] transition-standard w-full">
        <main
          className="flex-1"
          style={{
            paddingTop: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
          }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-[var(--spacing-md)]">{children}</div>
        </main>
        <Footer />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
