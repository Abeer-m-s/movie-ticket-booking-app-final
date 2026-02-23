import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovieById } from '../api';
import { getPosterForMovie } from '../data/animeSlideshow';
import Navbar from '../components/Navbar';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    getMovieById(id)
      .then(setMovie)
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id, user, authLoading, navigate]);

  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h} HR${h > 1 ? 'S' : ''} ${m} MINS` : `${m} MINS`;
  };

  if (authLoading || !user) return null;
  if (loading) return <div className="movie-detail-loading">Loading...</div>;

  if (!movie) {
    return (
      <div className="movies-page">
        <Navbar />
        <div className="movies-content">
          <p>Movie not found.</p>
        </div>
      </div>
    );
  }

  const posterUrl = getPosterForMovie(movie) || `https://picsum.photos/seed/${movie._id}/800/1200`;
  const genres = (movie.genre || 'Anime').split(',').map((g) => g.trim().toUpperCase());

  return (
    <div className="movie-detail-page">
      <Navbar />
      <div className="movie-detail-hero">
        <div
          className="movie-detail-poster"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="movie-detail-overlay" />
        <div className="movie-detail-content">
          <div className="movie-detail-genres">
            {genres.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
          <h1 className="movie-detail-title">{movie.title}</h1>
          <div className="movie-detail-meta">
            {formatDuration(movie.duration) && <span>{formatDuration(movie.duration)}</span>}
            <span>{movie.language}</span>
            {movie.rating && <span>{movie.rating}/10</span>}
          </div>
          {movie.description && (
            <p className="movie-detail-synopsis">{movie.description}</p>
          )}
          <div className="movie-detail-actions">
            <button className="btn-trailer" disabled> TRAILER </button>
            <button
              className="btn-book-now"
              onClick={() => navigate(`/theatres/${movie._id}`)}
            >
              BOOK NOW →
            </button>
          </div>
          {movie.rating && (
            <div className="movie-detail-ratings">
              <div className="rating-item">
                <span className="rating-value">{movie.rating}</span>
                <span className="rating-label">IMDB</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
