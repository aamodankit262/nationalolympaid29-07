import { ExternalLink } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-8 sm:py-12 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="animate-scale-in">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4 group">
              <div className="bg-white p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                <Link to='/'>
                  <img
                    src="/assets/safeLogo.webp"
                    alt="SAFE Academy Logo"
                    className="h-8 sm:h-10 w-auto"
                  />
                </Link>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">SAFE Academy</h3>
                <p className="text-xs text-white/80">Sodhani Academy of Fintech Enablers Limited</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed text-xs sm:text-sm">
              Empowering students with financial literacy through comprehensive education and
              competitive learning experiences. Building a financially aware generation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Quick Links</h4>
            <div className="space-y-2">
              {[
                { id: 'about', label: 'About Olympiad' },
                { id: 'participation', label: 'Participation Categories' },
                { id: 'awards', label: 'Awards & Prizes' },
                { id: 'contact', label: 'Contact Us' }
              ].map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => {
                    const element = document.getElementById(link.id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm text-left hover:translate-x-2 hover:text-cyan-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Contact Info</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-white/90 hover:text-cyan-300 transition-colors duration-300">📞 +91 92516 67818 / +91 90570 90999</p>
              <p className="text-white/90 hover:text-cyan-300 transition-colors duration-300">✉️ info@safefintech.in</p>
              <p className="text-white/90 hover:text-cyan-300 transition-colors duration-300">🌐 www.safefintech.in</p>
              <p className="text-white/90 text-xs leading-relaxed hover:text-cyan-300 transition-colors duration-300">
                📍 Sodhani House, C 373, C Block, Behind Amar Jain Hospital,
                Amrapali Circle, Vaishali Nagar, Jaipur 302021
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-xs sm:text-sm text-white/80 text-center md:text-left">
              © 2025 Sodhani Academy of Fintech Enablers Limited. All rights reserved.
              <span className="block md:inline md:ml-2">(A Bombay Stock Exchange Listed Company)</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.safefintech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-cyan-300 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm hover:scale-105"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <NavLink to={`/privacy-policy`}
                className="text-white/80 hover:text-cyan-300 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm hover:scale-105"
              >Privacy Policy</NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
