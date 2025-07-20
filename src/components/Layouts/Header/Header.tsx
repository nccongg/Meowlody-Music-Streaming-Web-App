import { faChartSimple, faHeart, faHome, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', icon: faHome, path: '/' },
  { name: 'Your Library', icon: faChartSimple, path: '/library' },
  { name: 'Liked Songs', icon: faHeart, path: '/likedsongs' },
];

const linkItems = [
  { name: 'Company', link: '/' },
  { name: 'Program', link: '/' },
  { name: 'Term & Policies', link: '/' },
];

function Header() {
  const location = useLocation();
  const pathName = location.pathname;
  return (
    <div className="w-[350px] h-screen bg-[#0f0f14] border-r-[1px] border-line fixed left-0 top-0 z-50">
      <div className="flex w-full h-full flex-col p-6 justify-between overflow-y-auto">
        <div>
          <Link to="/" className="flex gap-4 items-center mb-8 text-white hover:text-white">
            <FontAwesomeIcon icon={faMusic} className="w-7 h-7 text-[var(--primary-color)]" />
            <span className="text-2xl font-bold">Meowlody</span>
          </Link>
          <div className="mb-6">
            <div className="flex items-center p-3 mb-4 bg-[#1a1a24] border border-transparent focus-within:border focus-within:border-[var(--primary-color)] rounded-lg">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Search" className="w-full bg-transparent focus:border-0 outline-none text-white" />
            </div>
            {navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  className={`flex relative items-center rounded-lg hover:bg-[#1a1a24] hover:text-white p-4 mb-2 text-gray-300 transition-colors ${
                    pathName === item.path && 'text-white bg-[#1a1a24]'
                  }`}
                  to={item.path}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-4" />
                  <span className="text-[15px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-400 font-medium px-2">Your Playlists</span>
            {/* Placeholder for playlists */}
            <div className="mt-3 rounded-lg p-4 bg-[#1a1a24] bg-opacity-40 text-gray-400 text-sm">
              Create your first playlist
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col mt-4">
          <div className="w-full h-[1px] bg-[#282834] mb-4" />
          <div className="flex flex-wrap gap-4">
            {linkItems.map((item, index) => {
              return (
                <a
                  className="no-underline text-sm text-gray-400 hover:text-white transition-colors"
                  key={index}
                  href={item.link}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
          <span className="text-xs text-gray-500 font-thin mt-4">© 2025 NCCONGG</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
