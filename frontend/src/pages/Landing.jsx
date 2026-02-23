import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ANIME_SLIDES } from '../data/animeSlideshow';
import './Landing.css';

export default function Landing() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % ANIME_SLIDES.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing">
      <Navbar />
      <div className="slideshow">
        {ANIME_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.poster})` }}
          />
        ))}
        <div className="slideshow-overlay" />
        <div className="slideshow-content">
          <h1 className="slideshow-title">ANIME CINEMA</h1>
          <p className="slideshow-subtitle">
            {ANIME_SLIDES[current].title}
          </p>
          <p className="slideshow-tagline">Book your tickets for the finest anime films</p>
          <Link to="/login" className="btn-cta">Get Started</Link>
        </div>
        <div className="slideshow-dots">
          {ANIME_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
