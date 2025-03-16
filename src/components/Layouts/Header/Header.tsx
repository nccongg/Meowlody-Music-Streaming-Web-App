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
    <div className="w-[350px] h-screen bg-black border-r-[1px] border-line">
      <div className="flex w-[100%-10] h-full flex-col p-10 justify-between">
        <div>
          <Link to="/" className="flex gap-5 items-center mb-10 text-white hover:text-white">
            <FontAwesomeIcon icon={faMusic} className="w-[28px] h-[28px] text-[var(--primary-color)]" />
            <span className="text-[24px]">Meowlody</span>
          </Link>
          <div className="ml-10">
            <div className="flex items-center p-3 mb-1 border border-transparent focus-within:border focus-within:border-[var(--primary-color)] rounded-lg">
              <FontAwesomeIcon icon={faSearch} className="w-[24px] h-[24px] pr-7" />
              <input type="text" placeholder="Search" className="w-full bg-transparent focus:border-0 outline-none" />
            </div>
            {navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  className={`flex relative items-center hover:bg-[var(--bg-item-color)] hover:text-white p-5 text-description transition-colors before:absolute before:bottom-0 before:left-[0%] before:w-0 before:h-[2px] before:bg-white ${
                    pathName === item.path && 'text-white before:transition-all before:duration-500 before:w-full'
                  }`}
                  to={item.path}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-[24px] h-[24px] pr-7" />
                  <span className="text-[14px] font-thin">{item.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="ml-10 mt-[20px]">
            <span className="text-[13px] text-description font-thin">Your Playlists</span>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full h-[1px] bg-line" />
          {linkItems.map((item, index) => {
            return (
              <a
                className="no-underline text-[14px] text-description pt-[10px] pl-[10px] hover:text-white"
                key={index}
                href={item.link}
              >
                {item.name}
              </a>
            );
          })}
          {/* <div className="w-full h-[1px] mt-[10px] bg-line" /> */}
          <span className="text-[13px] text-description font-thin mt-[10px] pl-[10px]">© 2025 NCCONGG</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
