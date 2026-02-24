import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  createMovie,
  createTheatre,
  checkAdmin,
  getMovies,
  updateMovie,
  getAllBookingsAdmin,
} from '../api';
import './Admin.css';

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [movieForm, setMovieForm] = useState({
    title: '',
    genre: '',
    language: 'Japanese',
    duration: '',
    rating: '',
    description: '',
    poster: '',
    trailerUrl: '',
  });

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movies, setMovies] = useState([]);

  const [theatreForm, setTheatreForm] = useState({
    name: '',
    location: '',
    totalScreens: '',
  });

  const [bookings, setBookings] = useState([]);

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
      }
      checkAdmin()
        .then(async () => {
          const [moviesData, bookingsData] = await Promise.all([
            getMovies(),
            getAllBookingsAdmin().catch(() => []),
          ]);
          setMovies(moviesData || []);
          setBookings(bookingsData || []);
        })
        .catch(() => {
          navigate('/login');
        });
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== 'admin') return null;

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovieForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTheatreChange = (e) => {
    const { name, value } = e.target;
    setTheatreForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetMovieForm = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: '',
      genre: '',
      language: 'Japanese',
      duration: '',
      rating: '',
      description: '',
      poster: '',
      trailerUrl: '',
    });
  };

  const handleCreateOrUpdateMovie = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...movieForm,
        duration: Number(movieForm.duration) || 0,
        rating: movieForm.rating === '' ? undefined : Number(movieForm.rating),
      };

      if (editingMovieId) {
        const updated = await updateMovie(editingMovieId, payload);
        setStatus('Movie updated successfully.');
        setMovies((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      } else {
        const created = await createMovie(payload);
        setStatus('Movie added successfully. It is now visible to users.');
        setMovies((prev) => [created, ...prev]);
      }

      resetMovieForm();
    } catch (err) {
      setError(err.message || 'Failed to save movie');
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title || '',
      genre: movie.genre || '',
      language: movie.language || 'Japanese',
      duration: movie.duration?.toString() || '',
      rating: movie.rating?.toString() || '',
      description: movie.description || '',
      poster: movie.poster || '',
      trailerUrl: movie.trailerUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...theatreForm,
        totalScreens: Number(theatreForm.totalScreens) || 1,
      };
      await createTheatre(payload);
      setStatus('Theatre added successfully.');
      setTheatreForm({
        name: '',
        location: '',
        totalScreens: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to add theatre');
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">
          Logged in as <strong>admin@gmail.com</strong>. Manage anime movies, theatres and view all bookings.
        </p>

        {status && <div className="admin-status success">{status}</div>}
        {error && <div className="admin-status error">{error}</div>}

        <div className="admin-grid">
          <section className="admin-card">
            <h2>{editingMovieId ? 'Edit Anime Movie' : 'Add Anime Movie'}</h2>
            <form onSubmit={handleCreateOrUpdateMovie} className="admin-form">
              <label>
                Title
                <input
                  name="title"
                  value={movieForm.title}
                  onChange={handleMovieChange}
                  required
                />
              </label>
              <label>
                Genres (comma separated)
                <input
                  name="genre"
                  value={movieForm.genre}
                  onChange={handleMovieChange}
                  placeholder="Action, Fantasy"
                  required
                />
              </label>
              <label>
                Language
                <input
                  name="language"
                  value={movieForm.language}
                  onChange={handleMovieChange}
                  required
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  name="duration"
                  type="number"
                  min="1"
                  value={movieForm.duration}
                  onChange={handleMovieChange}
                  required
                />
              </label>
              <label>
                Rating (out of 10)
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={movieForm.rating}
                  onChange={handleMovieChange}
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  rows="3"
                  value={movieForm.description}
                  onChange={handleMovieChange}
                  required
                />
              </label>
              <label>
                Poster URL
                <input
                  name="poster"
                  value={movieForm.poster}
                  onChange={handleMovieChange}
                  placeholder="https://..."
                  required
                />
              </label>
              <label>
                Trailer URL
                <input
                  name="trailerUrl"
                  value={movieForm.trailerUrl}
                  onChange={handleMovieChange}
                  placeholder="https://youtube.com/..."
                />
              </label>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn">
                  {editingMovieId ? 'Update Movie' : 'Add Movie'}
                </button>
                {editingMovieId && (
                  <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={resetMovieForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {movies.length > 0 && (
              <div className="admin-movie-list">
                <h3>Existing Movies</h3>
                <ul>
                  {movies.map((m) => (
                    <li key={m._id}>
                      <div>
                        <strong>{m.title}</strong>
                        <span> ({m.language})</span>
                      </div>
                      <button
                        type="button"
                        className="admin-link-button"
                        onClick={() => handleEditClick(m)}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="admin-card">
            <h2>Add Theatre</h2>
            <form onSubmit={handleCreateTheatre} className="admin-form">
              <label>
                Name
                <input
                  name="name"
                  value={theatreForm.name}
                  onChange={handleTheatreChange}
                  required
                />
              </label>
              <label>
                Location
                <input
                  name="location"
                  value={theatreForm.location}
                  onChange={handleTheatreChange}
                  required
                />
              </label>
              <label>
                Total Screens
                <input
                  name="totalScreens"
                  type="number"
                  min="1"
                  value={theatreForm.totalScreens}
                  onChange={handleTheatreChange}
                  required
                />
              </label>
              <button type="submit" className="admin-btn">
                Add Theatre
              </button>
            </form>
          </section>
        </div>

        <section className="admin-card admin-bookings-card">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="admin-bookings-table-wrapper">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Theatre</th>
                    <th>Show Time</th>
                    <th>Seats</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div>{b.user?.name}</div>
                        <div className="admin-booking-email">{b.user?.email}</div>
                      </td>
                      <td>{b.show?.movie?.title}</td>
                      <td>
                        <div>{b.show?.theatre?.name}</div>
                        <div className="admin-booking-venue">
                          {b.show?.theatre?.location}
                        </div>
                      </td>
                      <td>
                        {b.show?.showDateTime
                          ? new Date(b.show.showDateTime).toLocaleString()
                          : '-'}
                      </td>
                      <td>
                        {Array.isArray(b.seats)
                          ? b.seats.map((s) => s.seatNumber).join(', ')
                          : ''}
                      </td>
                      <td>₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
