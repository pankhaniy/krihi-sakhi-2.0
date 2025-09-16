import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Menu, X, Phone, Mail, MapPin } from 'lucide-react';

interface WelcomePageProps {
  onNavigate: (page: string) => void;
}

export default function WelcomePage({ onNavigate }: WelcomePageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pop--in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with 'pop' class
    const popElements = document.querySelectorAll('.pop');
    popElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I register as a new farmer?",
      answer: "Click 'New Farmer – Get Started,' enter your mobile number, verify with OTP, and follow the step-by-step guide."
    },
    {
      question: "Can I use Krishi Sakhi in my local language?",
      answer: "Yes! We currently support Malayalam, Hindi, and English, and are working on adding more."
    },
    {
      question: "Will I get weather alerts on my phone?",
      answer: "Absolutely. You can opt for daily SMS/WhatsApp reminders for weather and crop tips."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. Your farm details are private, and we never share them without your consent."
    }
  ];

  return (
    <div className="homepage">
      {/* Sticky Navigation */}
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__brand">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="navbar__title">Krishi Sakhi</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="navbar__nav">
            <li><button className="button" onClick={() => scrollToSection('home')}>Home</button></li>
            <li><button className="button" onClick={() => scrollToSection('offer')}>What We Offer</button></li>
            <li><button className="button" onClick={() => scrollToSection('contact')}>Contact Us</button></li>
            <li><button className="button" onClick={() => scrollToSection('about')}>About Us</button></li>
            <li><button className="button" onClick={() => scrollToSection('faq')}>FAQ</button></li>
            <li>
              <select 
                className="button language-select" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ml')}
              >
                <option value="en">English</option>
                <option value="ml">Malayalam</option>
                <option value="hi">Hindi</option>
              </select>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="navbar__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="navbar__mobile-menu">
            <button className="button" onClick={() => scrollToSection('home')}>Home</button>
            <button className="button" onClick={() => scrollToSection('offer')}>What We Offer</button>
            <button className="button" onClick={() => scrollToSection('contact')}>Contact Us</button>
            <button className="button" onClick={() => scrollToSection('about')}>About Us</button>
            <button className="button" onClick={() => scrollToSection('faq')}>FAQ</button>
            <select 
              className="button language-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ml')}
            >
              <option value="en">English</option>
              <option value="ml">Malayalam</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="hero__tagline" aria-live="polite">
            <span className="hero__tagline-text">Personal guidance for your crops, in your own language.</span>
          </h1>
          <div className="hero__ctas">
            <button 
              onClick={() => onNavigate('register')}
              className="button" 
              aria-label="New Farmer, Get Started"
            >
              New Farmer – Get Started
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="button" 
              aria-label="Already Registered, Login"
            >
              I've Already Registered – Login
            </button>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offer" id="offer" aria-labelledby="offer-title">
        <div className="offer__inner">
          <header className="offer__head">
            <h2 className="offer__title" id="offer-title">What We Offer</h2>
            <p className="offer__subtitle">Farmer-first guidance, every day.</p>
          </header>

          {/* Desktop Grid */}
          <div className="offer__grid" role="list">
            <article className="offer__card pop" role="listitem" tabIndex={0}>
              <div className="offer__icon" aria-hidden="true">🌦️</div>
              <h3 className="offer__card-title">Weather-based Advice</h3>
              <p className="offer__card-text">Plan irrigation & spray with hyper-local forecasts.</p>
            </article>

            <article className="offer__card pop" role="listitem" tabIndex={0}>
              <div className="offer__icon" aria-hidden="true">🐛</div>
              <h3 className="offer__card-title">Pest & Disease Alerts</h3>
              <p className="offer__card-text">Catch problems early with nearby outbreak warnings.</p>
            </article>

            <article className="offer__card pop" role="listitem" tabIndex={0}>
              <div className="offer__icon" aria-hidden="true">⏰</div>
              <h3 className="offer__card-title">Task Reminders</h3>
              <p className="offer__card-text">Never miss sowing, weeding, feeding, or harvest.</p>
            </article>

            <article className="offer__card pop" role="listitem" tabIndex={0}>
              <div className="offer__icon" aria-hidden="true">📈</div>
              <h3 className="offer__card-title">Market & Schemes</h3>
              <p className="offer__card-text">Price trends & personalized government benefits.</p>
            </article>
          </div>

          {/* Mobile Carousel */}
          <div className="offer__track" aria-label="What We Offer cards (carousel)">
            <article className="offer__slide pop">
              <div className="offer__icon" aria-hidden="true">🌦️</div>
              <h3 className="offer__card-title">Weather-based Advice</h3>
              <p className="offer__card-text">Plan irrigation & spray with hyper-local forecasts.</p>
            </article>

            <article className="offer__slide pop">
              <div className="offer__icon" aria-hidden="true">🐛</div>
              <h3 className="offer__card-title">Pest & Disease Alerts</h3>
              <p className="offer__card-text">Catch problems early with nearby outbreak warnings.</p>
            </article>

            <article className="offer__slide pop">
              <div className="offer__icon" aria-hidden="true">⏰</div>
              <h3 className="offer__card-title">Task Reminders</h3>
              <p className="offer__card-text">Never miss sowing, weeding, feeding, or harvest.</p>
            </article>

            <article className="offer__slide pop">
              <div className="offer__icon" aria-hidden="true">📈</div>
              <h3 className="offer__card-title">Market & Schemes</h3>
              <p className="offer__card-text">Price trends & personalized government benefits.</p>
            </article>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about" id="about">
        <div className="about__inner">
          <header className="about__head">
            <h2>About Us</h2>
            <p>Your farming friend – guiding you every season.</p>
          </header>

          <div className="about__grid">
            <div className="about__image pop">
              <div className="farmer-illustration">
                <span className="farmer-emoji">👨‍🌾</span>
              </div>
            </div>
            <div className="about__content pop">
              <p>Krishi Sakhi is a digital companion for farmers. We provide personalized crop advice, weather updates, government scheme reminders, and market insights — in your own language.</p>
              <ul>
                <li>🌱 Farmer-first design, simple language</li>
                <li>🌦️ Daily tips based on weather & crop stage</li>
                <li>📈 Market prices & scheme alerts</li>
                <li>🤝 Trusted by farmers and supported by local organizations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact" id="contact">
        <div className="contact__inner">
          <header className="contact__head">
            <h2>Contact Us</h2>
            <p>We're here to help you grow smarter.</p>
          </header>

          <div className="contact__grid">
            {/* Contact Info */}
            <aside className="contact__info pop">
              <div className="info-item">
                <Phone className="w-5 h-5" />
                <span>Helpline: <a href="tel:+911800123456">1800-123-456</a></span>
              </div>
              <div className="info-item">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                <span><a href="https://wa.me/911234567890?text=Hi%20Krishi%20Sakhi">Chat on WhatsApp</a></span>
              </div>
              <div className="info-item">
                <Mail className="w-5 h-5" />
                <span><a href="mailto:support@krishisakhi.in">support@krishisakhi.in</a></span>
              </div>
              <div className="info-item">
                <span className="text-sm text-gray-600">Available 9am–6pm IST, Mon–Sat</span>
              </div>
            </aside>

            {/* Contact Form */}
            <form className="contact__form pop">
              <input type="text" placeholder="Your Name" required />
              <input type="tel" placeholder="+91 98765 43210" required />
              <textarea placeholder="Your Message" required rows={4}></textarea>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to be contacted via WhatsApp/SMS</span>
              </label>
              <button type="submit" className="button">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="faq__inner">
          <header className="faq__head">
            <h2>Frequently Asked Questions</h2>
          </header>

          <div className="faq__list">
            {faqData.map((item, index) => (
              <div key={index} className="faq__item pop">
                <button 
                  className="faq__question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeFAQ === index}
                >
                  {item.question}
                  <span className="faq__icon">
                    {activeFAQ === index ? '−' : '+'}
                  </span>
                </button>
                <div className={`faq__answer ${activeFAQ === index ? 'faq__answer--open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <div className="whatsapp-float">
        <a
          href="https://wa.me/911234567890?text=Hi%20Krishi%20Sakhi"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}