import { useState, useEffect } from 'react';
import './TestimonialsSection.css';
import { Check } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchTestimonials = async () => {
    try {
      const fetchUrl = import.meta.env.PROD 
        ? `${import.meta.env.BASE_URL}data.json` 
        : 'http://localhost:3001/api/testimonials';

      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('Server returned error');
      const data = await res.json();
      
      const testimonialsData = import.meta.env.PROD ? data.testimonials : data;
      if (Array.isArray(testimonialsData)) {
        setTestimonials(testimonialsData);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (import.meta.env.PROD) {
      setSubmitMessage('Note: Submissions are disabled on the live demo. This feature requires a backend server.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const res = await fetch('http://localhost:3001/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content })
      });
      
      if (res.ok) {
        setSubmitMessage('Thank you! Your testimonial has been added.');
        setName('');
        setEmail('');
        setContent('');
        // Add a tiny delay to ensure the server has finished writing to disk
        setTimeout(() => {
          fetchTestimonials();
        }, 100);
      } else {
        const errorData = await res.json();
        setSubmitMessage(errorData.error || 'Failed to add testimonial.');
      }
    } catch (err) {
      setSubmitMessage('Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="testimonials-section">
      {/* Header */}
      <div className="testimonials-header animate-fade-in-up reveal-on-scroll">
        <div>
          <span className="section-label">Testimonials</span>
          <div className="section-label-line" />
          <h2 className="section-title-serif">What People<br />Say About Me</h2>
        </div>
        <div className="testimonials-header__right">
          <p className="testimonials-intro">
            Kind words from clients and colleagues I've had the pleasure of working with. 
            Have we worked together? Feel free to leave a testimonial below!
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="testimonials-grid">
        {testimonials.map((t, index) => (
          <div
            key={t.id}
            className="testimonial-card animate-fade-in-up reveal-on-scroll"
            style={{ animationDelay: `${Math.min(0.15 + index * 0.1, 1.5)}s` }}
          >
            {/* Quote mark */}
            <div className="tcard-quote">"</div>
            <p className="tcard-content">{t.content}</p>
            <div className="tcard-author">
              <img src={t.avatar} alt={t.name} className="tcard-avatar" />
              <div className="tcard-author-info">
                <p className="tcard-name">
                  {t.name}
                  {(t as any).verified && (
                    <span className="verified-badge" title="Verified Client">
                      <Check size={12} />
                    </span>
                  )}
                </p>
                <span className="tcard-role">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Testimonial Form */}
      <div className="testimonial-form-container animate-fade-in-up reveal-on-scroll" style={{ animationDelay: '0.5s' }}>
        <h3 className="testimonial-form-title">Leave a Testimonial</h3>
        <form className="testimonial-form" onSubmit={handleSubmit}>
          <div className="testimonial-form-row">
            <input 
              type="text" 
              placeholder="Your Name" 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
            />
            <input 
              type="email" 
              placeholder="Your Email (used for your Gravatar photo)" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <textarea 
            placeholder="What was it like working together?" 
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            className="form-textarea"
            rows={4}
          />
          <div className="testimonial-form-footer">
            <button type="submit" className="btn-coral" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>
            {submitMessage && <span className="submit-message">{submitMessage}</span>}
          </div>
        </form>
      </div>
    </section>
  );
};

export default TestimonialsSection;

