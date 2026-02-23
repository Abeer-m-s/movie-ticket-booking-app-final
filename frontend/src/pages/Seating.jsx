import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSeatsByShow } from '../api';
import Navbar from '../components/Navbar';
import './Seating.css';

export default function Seating() {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    getSeatsByShow(showId)
      .then(setSeats)
      .catch(() => setSeats([]))
      .finally(() => setLoading(false));
  }, [showId, user, authLoading, navigate]);

  const toggleSeat = (seat) => {
    if (seat.status === 'booked') return;
    setSelected((prev) =>
      prev.some((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat]
    );
  };

  const handleProceed = () => {
    if (selected.length === 0) return;
    navigate(`/payment/${showId}`, {
      state: { seatIds: selected.map((s) => s._id), seats: selected },
    });
  };

  const byRow = seats.reduce((acc, s) => {
    const row = s.seatNumber?.replace(/[0-9]/g, '') || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(s);
    acc[row].sort((a, b) => {
      const numA = parseInt(a.seatNumber?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.seatNumber?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    });
    return acc;
  }, {});
  const rowOrder = Object.keys(byRow).sort();

  if (authLoading || !user) return null;

  return (
    <div className="seating-page">
      <Navbar />
      <div className="seating-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="seating-title">Select Seats</h1>
        {loading ? (
          <div className="seating-loading">Loading seats...</div>
        ) : (
          <>
            <div className="screen-label">SCREEN</div>
            <div className="seats-grid">
              {rowOrder.map((row) => {
                const rowSeats = byRow[row];
                return (
                <div key={row} className="seat-row">
                  <span className="row-label">{row}</span>
                  {rowSeats.map((seat) => {
                    const isSelected = selected.some((s) => s._id === seat._id);
                    return (
                      <button
                        key={seat._id}
                        className={`seat ${seat.seatType} ${seat.status} ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.status === 'booked'}
                        title={seat.seatNumber}
                      >
                        {seat.seatNumber?.replace(row, '') || seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              );
              })}
            </div>
            <div className="seat-legend">
              <span><span className="legend-box available" /> Available</span>
              <span><span className="legend-box selected" /> Selected</span>
              <span><span className="legend-box booked" /> Booked</span>
            </div>
            <div className="seating-summary">
              <p>
                {selected.length} seat(s) selected
                {selected.length > 0 && (
                  <button className="btn-proceed" onClick={handleProceed}>
                    Proceed to Payment →
                  </button>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
