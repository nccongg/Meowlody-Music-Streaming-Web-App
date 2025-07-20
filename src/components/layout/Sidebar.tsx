import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faCat } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/search', icon: faSearch, label: 'Search' },
    { path: '/library', icon: faMusic, label: 'Your Library' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[var(--sidebar-width-collapsed)] md:hover:w-[var(--sidebar-width-expanded)] backdrop-blur-xl bg-[#0f0f14]/90 transition-all duration-300 group z-[var(--z-sidebar)] ${className}`}
    >
      <div className="h-full flex flex-col p-4 md:p-[var(--spacing-md)]">
        <Link
          to="/"
          className="mb-8 md:mb-[var(--spacing-xl)] flex items-center justify-center md:group-hover:justify-start"
        >
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-brand-primary)] overflow-hidden whitespace-nowrap">
            <FontAwesomeIcon
              icon={faCat}
              className="w-8 h-8 md:w-[var(--icon-size-lg)] md:h-[var(--icon-size-lg)] md:group-hover:mr-[var(--spacing-md)]"
            />
            <span className="hidden md:inline-block opacity-0 group-hover:opacity-100 transition-standard">
              Meowlody
            </span>
          </h1>
        </Link>

        <nav className="flex-1 flex flex-col items-center md:group-hover:items-stretch">
          {navItems.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center justify-center md:group-hover:justify-start w-full gap-2 md:gap-[var(--spacing-md)] px-3 md:px-[var(--spacing-md)] py-3 md:py-[var(--spacing-sm)] rounded-[var(--radius-md)] mb-2 md:mb-[var(--spacing-xs)] transition-all duration-300 overflow-hidden whitespace-nowrap hover:bg-white/10 
                ${
                  isActive(path)
                    ? 'text-[var(--color-brand-primary)] bg-[#ffffff1a] font-bold border-l-4 border-[var(--color-brand-primary)]'
                    : 'text-[var(--color-text-muted)]'
                }
              `}
            >
              <FontAwesomeIcon icon={icon} className="w-6 h-6 md:w-[var(--icon-size)] md:h-[var(--icon-size)]" />
              <span className="hidden md:group-hover:inline transition-standard">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden md:group-hover:block">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] px-[var(--spacing-md)] mb-[var(--spacing-md)]">
            Playlists
          </h2>
          <div className="space-y-[var(--spacing-xs)]">
            <button className="w-full text-left px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] hover:bg-white/10 transition-all duration-300">
              Create Playlist
            </button>
            <button className="w-full text-left px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] hover:bg-white/10 transition-all duration-300">
              Liked Songs
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
