import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShows, getMovieById } from '../api';
import Navbar from '../components/Navbar';
import './Theatres.css';

export default function Theatres() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showsByTheatre, setShowsByTheatre] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          getMovieById(movieId),
          getShows(),
        ]);
        setMovie(movieRes);
        const forMovie = (showsRes || []).filter(
          (s) => s.movie?._id === movieId || s.movie === movieId
        );
        const byTheatre = {};
        forMovie.forEach((s) => {
          const tid = s.theatre?._id || s.theatre;
          if (!byTheatre[tid]) {
            byTheatre[tid] = { theatre: s.theatre, shows: [] };
          }
          byTheatre[tid].shows.push(s);
        });
        setShowsByTheatre(Object.values(byTheatre));
      } catch {
        setMovie(null);
        setShowsByTheatre([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieId, user, authLoading, navigate]);

  const handleSelectShow = (show) => {
    navigate(`/seats/${show._id}`);
  };

  if (authLoading || !user) return null;

  return (
    <div className="theatres-page">
      <Navbar />
      <div className="theatres-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        {loading ? (
          <div className="theatres-loading">Loading theatres...</div>
        ) : (
          <>
            <h1 className="theatres-title">
              Select Theatre for {movie?.title || 'Movie'}
            </h1>
            {showsByTheatre.length === 0 ? (
              <p className="theatres-empty">No shows available for this movie.</p>
            ) : (
              <div className="theatres-list">
                {showsByTheatre.map(({ theatre, shows }) => (
                  <div key={theatre?._id} className="theatre-card">
                    <div className="theatre-info">
                      <h3>{theatre?.name}</h3>
                      <p>{theatre?.location}</p>
                    </div>
                    <div className="shows-list">
                      {shows
                        .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
                        .map((show) => (
                          <button
                            key={show._id}
                            className="show-slot"
                            onClick={() => handleSelectShow(show)}
                          >
                            {new Date(show.showDateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            <span className="show-price">₹{show.ticketPrice}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
