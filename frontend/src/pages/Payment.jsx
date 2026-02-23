import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../api';
import Navbar from '../components/Navbar';
import './Payment.css';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'cash', label: 'Cash at Counter', icon: '💵' },
];

export default function Payment() {
  const { showId } = useParams();
  const { state } = useLocation();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const seatIds = state?.seatIds || [];
  const seats = state?.seats || [];

  if (!authLoading && !user) {
    navigate('/login');
    return null;
  }

  const handlePay = async () => {
    if (seatIds.length === 0) {
      setError('No seats selected. Go back and select seats.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createBooking(showId, seatIds, method);
      navigate('/movies', { state: { bookingSuccess: true } });
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="payment-title">Payment</h1>
        {error && <div className="payment-error">{error}</div>}
        <div className="payment-summary">
          <p>Seats: {seats.map((s) => s.seatNumber).join(', ')}</p>
          <p>{seatIds.length} ticket(s)</p>
        </div>
        <div className="payment-methods">
          <h3>Select payment method</h3>
          {PAYMENT_METHODS.map((m) => (
            <label key={m.id} className={`payment-option ${method === m.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="method"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
              />
              <span className="option-icon">{m.icon}</span>
              <span className="option-label">{m.label}</span>
            </label>
          ))}
        </div>
        <button
          className="btn-pay"
          onClick={handlePay}
          disabled={loading || seatIds.length === 0}
        >
          {loading ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  );
}
