import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import StyleEditor from './components/StyleEditor';
import { extractColorsFromImage, applyPaletteToCSS } from './utils/colorExtractor';

function App() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Final fallback to ensure curtain is removed
      setTimeout(() => {
        const curtain = document.querySelector('.curtain');
        if (curtain) (curtain as HTMLElement).style.display = 'none';
      }, 1000);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // ── Scroll-reveal observer ──
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.08 });

    // Function to observe elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-observed)');
      elements.forEach(el => {
        observer.observe(el);
        el.classList.add('is-observed'); // Mark as observed so we don't re-observe
      });
    };

    // Initial observation
    observeElements();

    // Mutation observer to handle dynamically added content (testimonials, projects, etc.)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // ── Dynamic color scheme from developer.png ──
  useEffect(() => {
    // Only extract colors if the user hasn't saved a custom theme
    const hasCustomTheme = localStorage.getItem('portfolio_style_settings');
    if (hasCustomTheme) return;

    extractColorsFromImage(`${import.meta.env.BASE_URL}developer.png`)
      .then(palette => {
        applyPaletteToCSS(palette);
        console.log('🎨 Dynamic palette extracted:', palette);
      })
      .catch(() => {
        console.log('Using default color scheme');
      });
  }, []);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 5) {
      setShowAdminModal(true);
      setClickCount(0);
    }
  };

  return (
    <div className={`app-container ${isLoading ? 'is-loading' : ''}`}>
      {/* Curtain Entrance */}
      <div className={`curtain ${!isLoading ? 'curtain--open' : ''}`}>
        <div className="curtain__panel curtain__panel--left" />
        <div className="curtain__panel curtain__panel--right" />
        <div className="curtain__logo">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="curtain-logo-img" />
        </div>
      </div>

      <AdminDashboard isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
      <StyleEditor />
      <Sidebar />
      <main className="main-content">
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />

        {/* Footer */}
        <footer className="site-footer">
          <div className="site-footer__inner">
            <span 
              className="site-footer__logo" 
              onClick={handleLogoClick}
              title="© Asad Ali Janjua"
            >
              Asad Ali Janjua
            </span>
            <p className="site-footer__copy">© 2024 · Full Stack Web Developer · All Rights Reserved</p>
            <div className="site-footer__line" />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
