
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogin, userDetails, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/" || location.pathname === "/home") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    if (
      (location.pathname === "/" || location.pathname === "/home") &&
      location.state?.scrollTo
    ) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clean up state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 animate-fade-in pb-0">
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white py-2 px-2 md:px-4 animate-gradient relative overflow-hidden">
        {/* Floating Icons */}
        {/* <div className="absolute top-1 left-10 md:left-20 animate-float opacity-30">
          <BookOpen className="w-3 h-3 text-blue-300" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-1 right-10 md:right-32 animate-float opacity-30">
          <DollarSign className="w-3 h-3 text-green-300" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute top-1 left-1/2 animate-float opacity-30">
          <Target className="w-3 h-3 text-yellow-300" style={{ animationDelay: '2s' }} />
        </div> */}

        <div className="container mx-auto flex flex-wrap flex-col md:flex-row justify-between items-center text-xs md:text-sm relative z-10 gap-y-1 md:gap-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-1 hover:scale-105 transition-transform duration-300">
              <Phone className="w-3 h-3 animate-pulse" />
              <span>+91 92516 67818 / +91 90570 90999</span>
            </div>
            <div className="flex items-center space-x-1 hover:scale-105 transition-transform duration-300">
              <Mail className="w-3 h-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>info@safefintech.in</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 hover:scale-105 transition-transform duration-300">
            <MapPin className="w-3 h-3 animate-pulse" style={{ animationDelay: '1s' }} />
            <span>Sodhani House, Jaipur 302021</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-2 md:px-4 py-2 md:py-4">
        <div className="flex flex-row md:flex-row items-center justify-between gap-y-2 md:gap-y-0">
          {/* Logo */}
          <Link to="/" className="flex flex-row sm:flex-row items-center space-x-0 sm:space-x-6 group w-full md:w-auto">
            {/* SAFE Academy Block */}
            <div className="flex items-center space-x-2">
              <img
                src="/assets/safeLogo.webp"
                alt="SAFE Academy Logo"
                className="h-10 md:h-12 "
                // className="h-10 md:h-12 group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h1 className="font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent text-base md:text-lg leading-tight">
                  SAFE Academy
                </h1>
              
                {/* <p className="text-xs text-gray-600">
                  Sodhani Academy of Fintech <br /> Enablers Limited
                </p> */}
              </div>
            </div>
            {/* SK Finance Block */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <img
                src="/assets/SKLogo.webp"
                alt="SK Finance Logo"
                className="h-10 md:h-12"
                style={{ height: `60px` }}
              />
              <div>
                <h1 className="font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent text-xs md:text-sm leading-tight">
                  Supported by
                </h1>
                <p className="text-xs text-gray-600 font-medium">SK Finance</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 mt-2 md:mt-0">
            {['home', 'about', 'participation', 'dates', 'structure', 'awards', 'contact'].map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-700 hover:text-blue-900 transition-all duration-300 font-medium hover:scale-105 relative group text-sm xl:text-base"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            {isLogin ? (
              <>
                <Button
                  onClick={() => {
                    if (userDetails?.type === 'institute') {
                      navigate('/school-dashboard');
                    } else if (userDetails?.type === 'resource') {
                      navigate('/resource-person-dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  // disabled={
                  //   userDetails?.type === 'student' &&
                  //   (userDetails?.isPayment!== 1)
                  // }
                  className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm xl:text-base"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="ml-2 border-slate-800 text-sm xl:text-base"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm xl:text-base">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-900 transition-colors hover:scale-110 duration-300 ml-auto"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 pb-4 border-t border-gray-200 animate-fade-in w-full">
            <div className="flex flex-col space-y-2 pt-4 w-full">
              {['home', 'about', 'participation', 'dates', 'structure', 'awards', 'contact'].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-left text-gray-700 hover:text-blue-900 transition-colors font-medium hover:translate-x-2 duration-300 text-base px-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
              {isLogin ? (
                <>
                  <Button
                    onClick={() => {
                      if (userDetails?.type === 'institute') {
                        navigate('/school-dashboard');
                      } else if (userDetails?.type === 'resource') {
                        navigate('/resource-person-dashboard');
                      } else {
                        navigate('/dashboard');
                      }
                    }}
                    // disabled={
                    //   userDetails?.type === 'student' &&
                    //   (userDetails?.isPayment!== 1)
                    // }
                    className={`bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full text-base mt-2`}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="ml-2 border-slate-800 text-sm xl:text-base"
                  >
                    Logout
                  </Button>
                </>

              ) : (
                <Link to="/login" className="text-left w-full">
                  <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 w-full text-base mt-2">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
