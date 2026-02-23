import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../api';
import { getPosterForMovie } from '../data/animeSlideshow';
import Navbar from '../components/Navbar';
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    getMovies()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleBookNow = (movie) => {
    navigate(`/movie/${movie._id}`);
  };

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h} HR${h > 1 ? 'S' : ''} ${m} MINS` : `${m} MINS`;
  };

  if (authLoading || !user) return null;

  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-content">
        {state?.bookingSuccess && (
          <div className="booking-success">Booking successful! Enjoy your movie.</div>
        )}
        {loading ? (
          <div className="movies-loading">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="movies-empty">
            <p>No movies available. Add some anime films from the admin panel!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <article
                key={movie._id}
                className={`movie-card ${selected?._id === movie._id ? 'selected' : ''}`}
                onMouseEnter={() => setSelected(movie)}
                onMouseLeave={() => setSelected(null)}
              >
                <div
                  className="movie-poster"
                  style={{ backgroundImage: `url(${getPosterForMovie(movie)})` }}
                />
                <div className="movie-overlay">
                  <div className="movie-genre">{movie.genre?.toUpperCase()}</div>
                  <h2 className="movie-title">{movie.title}</h2>
                  <div className="movie-meta">
                    <span>{formatDuration(movie.duration || 0)}</span>
                    <span>{movie.language}</span>
                    {movie.rating && <span>{movie.rating}/10</span>}
                  </div>
                  {movie.description && (
                    <p className="movie-desc">{movie.description.slice(0, 120)}...</p>
                  )}
                  <button
                    className="btn-book"
                    onClick={() => handleBookNow(movie)}
                  >
                    BOOK NOW →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
