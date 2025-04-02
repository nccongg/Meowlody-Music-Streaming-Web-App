import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-black/30 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-all duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-purple-400 transition-all duration-300">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-purple-400 transition-all duration-300">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Communities</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/artists" className="hover:text-purple-400 transition-all duration-300">
                  For Artists
                </Link>
              </li>
              <li>
                <Link to="/developers" className="hover:text-purple-400 transition-all duration-300">
                  Developers
                </Link>
              </li>
              <li>
                <Link to="/advertising" className="hover:text-purple-400 transition-all duration-300">
                  Advertising
                </Link>
              </li>
              <li>
                <Link to="/investors" className="hover:text-purple-400 transition-all duration-300">
                  Investors
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="hover:text-purple-400 transition-all duration-300">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/mobile" className="hover:text-purple-400 transition-all duration-300">
                  Mobile App
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:text-purple-400 transition-all duration-300">
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100020378081627"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-white" />
              </a>
              <a
                href="https://www.instagram.com/nckonc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faYoutube} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0">
              <Link to="/legal" className="hover:text-purple-400 transition-all duration-300 mr-4">
                Legal
              </Link>
              <Link to="/privacy" className="hover:text-purple-400 transition-all duration-300 mr-4">
                Privacy Center
              </Link>
              <Link to="/cookies" className="hover:text-purple-400 transition-all duration-300 mr-4">
                Cookies
              </Link>
              <Link to="/about-ads" className="hover:text-purple-400 transition-all duration-300">
                About Ads
              </Link>
            </div>
            <div className="text-sm text-gray-400">© 2024 Meowlody. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
