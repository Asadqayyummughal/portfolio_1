import { useState, useEffect } from 'react';
import './Sidebar.css';
import { Download, Menu, X } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPos = window.scrollY + 100;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveTab(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'WebDev_Resume.pdf';
    link.click();
  };

  return (
    <>
      <header className={`topnav ${scrolled ? 'topnav--scrolled' : ''}`}>
        {/* Logo */}
        <div className="topnav__logo animate-fade-in" onClick={() => handleNavClick('home')} aria-label="Go to home">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Asad Janjua Logo" className="logo-img" />
        </div>

        {/* Nav Links */}
        <nav className={`topnav__links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`topnav__link ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="topnav__right">
          <button className="btn-outline-pill nav-cv-btn" onClick={handleDownloadCV}>
            <Download size={14} /> Download CV
          </button>
          <button
            className="mobile-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
