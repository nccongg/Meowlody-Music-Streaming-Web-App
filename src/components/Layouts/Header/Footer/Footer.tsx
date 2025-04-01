import { faFacebookF, faGithub, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FooterItems = [
  {
    title: 'Company',
    links: [
      { name: 'About', path: '/about' },
      { name: 'Jobs', path: '/jobs' },
      { name: 'For the Record', path: '/for-the-record' },
    ],
  },
  {
    title: 'Communities',
    links: [
      { name: 'For Artists', path: '/for-artists' },
      { name: 'Developers', path: '/developers' },
      { name: 'Advertising', path: '/advertising' },
      { name: 'Investors', path: '/investors' },
      { name: 'Vendors', path: '/vendors' },
    ],
  },
  {
    title: 'Useful Links',
    links: [
      { name: 'Support', path: '/support' },
      { name: 'Free Mobile App', path: '/free-mobile-app' },
    ],
  },
  {
    title: 'Spotify Plans',
    links: [
      { name: 'Premium Individual', path: '/premium-individual' },
      { name: 'Premium Student', path: '/premium-student' },
      { name: 'Spotify Free', path: '/spotify-free' },
    ],
  },
];

const SocialItems = [
  { name: 'Facebook', path: 'https://www.facebook.com/profile.php?id=100020378081627', icon: faFacebookF },
  { name: 'Instagram', path: 'https://www.instagram.com/nckonc/', icon: faInstagram },
  { name: 'Github', path: 'https://github.com/nccongg', icon: faGithub },
  {
    name: 'LinkedIn',
    path: 'https://www.linkedin.com/in/ch%C3%AD-c%C3%B4ng-nguy%E1%BB%85n-817b83318/',
    icon: faLinkedinIn,
  },
];

function Footer() {
  return (
    <div className="w-full bg-black p-[30px] px-[50px] flex flex-col">
      <div className=" w-full flex flex-row justify-between">
        {FooterItems.map((item, index) => {
          return (
            <div key={index} className="flex flex-col gap-3">
              <h2 className="text-[18px] font-bold">{item.title}</h2>
              {item.links.map((link, index) => {
                return (
                  <a
                    key={index}
                    href={link.path}
                    className="text-[16px] text-description hover:text-white hover:underline"
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          );
        })}

        <div className="flex flex-row gap-7">
          {SocialItems.map((item, index) => {
            return (
              <a
                href={item.path}
                key={index}
                className="w-[40px] h-[40px] bg-[var(--bg-albums-color)]  text-white flex items-center justify-center rounded-[50%] 
                    hover:bg-[var(--bg-albums-hover-color)] hover:cursor-pointer hover:text-white"
              >
                <FontAwesomeIcon icon={item.icon} />
              </a>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[1px] flex justify-center mt-10">
        <div className="w-full h-[1px] bg-line"></div>
      </div>
      <p className="text-[14px] text-description mt-10">© 2025 NCCONGG</p>
    </div>
  );
}

export default Footer;
