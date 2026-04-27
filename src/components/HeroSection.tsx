import './HeroSection.css';
import { ArrowRight, Github, Linkedin, Twitter, Edit, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';

const HeroSection = () => {
  const { content: globalContent, updateContent } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultHero = {
    eyebrow: 'Full Stack Developer',
    headline: 'Asad Ali\nJanjua',
    sub: 'Passionate about building scalable, robust, and user-friendly web applications with 5+ years of experience.',
    roleTitle: 'Full Stack\nWeb Developer',
    name: 'Asad Ali Janjua'
  };

  const content = { ...defaultHero, ...(globalContent.hero || {}) };
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
    setEditContent({ ...defaultHero, ...(globalContent.hero || {}) });
  }, [globalContent.hero]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSave = async () => {
    await updateContent('hero', editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <section id="home" className="hero-section">
      {/* ── LEFT PANEL: light background with photo ── */}
      <div className="hero-left">
        {/* Decorative elements */}
        <div className="deco-circle hero-deco-circle-1" />
        <div className="deco-circle hero-deco-circle-2" />
        <div className="dot-matrix hero-dot-matrix" />
        <div className="hero-arc" />

        {/* Photo */}
        <div className="hero-photo-wrap animate-fade-in reveal-on-scroll" style={{ animationDelay: '0.3s' }}>
          <img
            src={`${import.meta.env.BASE_URL}developer.png`}
            alt={content.name}
            className="hero-photo"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Fallback silhouette when no photo */}
          <div className="hero-photo-fallback" aria-hidden="true">
            <div className="fallback-head" />
            <div className="fallback-body" />
          </div>
        </div>

        {/* Team card — bottom left */}
        <div className="hero-card animate-fade-in-left reveal-on-scroll" style={{ animationDelay: '0.5s' }}>
          <span className="section-label">About Me</span>
          <div className="section-label-line" />
          
          {isEditing ? (
            <input 
              className="edit-input-small"
              value={editContent.name} 
              onChange={e => setEditContent({...editContent, name: e.target.value})} 
            />
          ) : (
            <p className="hero-card__subtitle">{content.name}</p>
          )}

          {isEditing ? (
            <textarea 
              className="edit-textarea-small"
              value={editContent.roleTitle} 
              onChange={e => setEditContent({...editContent, roleTitle: e.target.value})} 
            />
          ) : (
            <h2 className="hero-card__role">
              {content.roleTitle.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h2>
          )}
          
          <a href="#projects" className="coral-link" onClick={(e) => { e.preventDefault(); scrollToProjects(); }}>
            View Work
          </a>
        </div>

        {/* Social links */}
        <div className="hero-socials animate-fade-in reveal-on-scroll" style={{ animationDelay: '0.7s' }}>
          <a href="#" className="hero-social-link" aria-label="GitHub"><Github size={18} /></a>
          <a href="#" className="hero-social-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="#" className="hero-social-link" aria-label="Twitter"><Twitter size={18} /></a>
        </div>
      </div>

      {/* ── RIGHT PANEL: coral ── */}
      <div className="hero-right">
        <div className="hero-right__inner animate-fade-in-right reveal-on-scroll" style={{ animationDelay: '0.4s' }}>
          {isEditing ? (
            <input 
              className="edit-input-small edit-input-light"
              value={editContent.eyebrow} 
              onChange={e => setEditContent({...editContent, eyebrow: e.target.value})} 
            />
          ) : (
            <span className="hero-right__eyebrow">{content.eyebrow}</span>
          )}

          {isEditing ? (
            <textarea 
              className="edit-textarea-large edit-input-light"
              value={editContent.headline} 
              onChange={e => setEditContent({...editContent, headline: e.target.value})} 
            />
          ) : (
            <h1 className="hero-right__headline">
              {content.headline.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
          )}

          {isEditing ? (
             <textarea 
               className="edit-textarea-medium edit-input-light"
               value={editContent.sub} 
               onChange={e => setEditContent({...editContent, sub: e.target.value})} 
             />
          ) : (
            <p className="hero-right__sub">
              {content.sub}
            </p>
          )}

          <div className="hero-right__actions">
            <button className="btn-pill" onClick={scrollToProjects}>
              View My Work <ArrowRight size={16} />
            </button>
            <button className="btn-pill btn-pill--ghost" onClick={scrollToContact}>
              Contact Me
            </button>
          </div>
          
          {isAdmin && (
            <div className="admin-edit-control animate-fade-in">
              {isEditing ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="edit-btn save-btn" onClick={handleSave}>
                    <Save size={16} /> Save Changes
                  </button>
                  <button className="edit-btn cancel-btn" onClick={handleCancel}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <Edit size={16} /> Edit Hero
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
