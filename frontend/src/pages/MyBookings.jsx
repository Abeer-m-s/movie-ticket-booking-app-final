import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../api';
import './MyBookings.css';

export default function MyBookings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }
      getMyBookings()
        .then((data) => setBookings(data || []))
        .catch((err) => setStatus(err.message || 'Failed to load bookings'));
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="my-bookings-content">
        <h1 className="my-bookings-title">My Tickets</h1>
        <p className="my-bookings-subtitle">
          View all your anime movie bookings and ticket details.
        </p>

        {status && <div className="my-bookings-status">{status}</div>}

        {bookings.length === 0 ? (
          <p className="my-bookings-empty">
            You have not booked any tickets yet.
          </p>
        ) : (
          <div className="my-bookings-list">
            {bookings.map((b) => {
              const movie = b.show?.movie;
              const theatre = b.show?.theatre;
              const showTime = b.show?.showDateTime
                ? new Date(b.show.showDateTime).toLocaleString()
                : '-';
              const seats = Array.isArray(b.seats)
                ? b.seats.map((s) => s.seatNumber).join(', ')
                : '';

              return (
                <article key={b._id} className="my-booking-card">
                  <div className="my-booking-header">
                    <h2>{movie?.title || 'Movie'}</h2>
                    <span className="my-booking-amount">₹{b.totalAmount}</span>
                  </div>
                  <div className="my-booking-meta">
                    <div>
                      <span className="label">Theatre</span>
                      <span>
                        {theatre?.name} {theatre?.location && `(${theatre.location})`}
                      </span>
                    </div>
                    <div>
                      <span className="label">Show time</span>
                      <span>{showTime}</span>
                    </div>
                    <div>
                      <span className="label">Seats</span>
                      <span>{seats}</span>
                    </div>
                    <div>
                      <span className="label">Tickets</span>
                      <span>{Array.isArray(b.seats) ? b.seats.length : '-'}</span>
                    </div>
                    <div>
                      <span className="label">Status</span>
                      <span className="my-booking-status">{b.status}</span>
                    </div>
                    <div>
                      <span className="label">Booking ID</span>
                      <span className="my-booking-id">{b._id}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

