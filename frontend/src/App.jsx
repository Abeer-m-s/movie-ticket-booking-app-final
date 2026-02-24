import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Theatres from './pages/Theatres';
import Seating from './pages/Seating';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/theatres/:movieId" element={<Theatres />} />
      <Route path="/seats/:showId" element={<Seating />} />
      <Route path="/payment/:showId" element={<Payment />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
