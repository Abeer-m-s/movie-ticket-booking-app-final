const API_BASE = 'https://movie-ticket-booking-app-final.onrender.com';

function getToken() {
  return localStorage.getItem('token');
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  return data;
}

export async function getMovies() {
  const res = await fetch(`${API_BASE}/movies`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function getMovieById(id) {
  const res = await fetch(`${API_BASE}/movies/${id}`);
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

export async function getShows() {
  const res = await fetch(`${API_BASE}/shows`);
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
}

export async function getTheatres() {
  const res = await fetch(`${API_BASE}/theatres`);
  if (!res.ok) throw new Error('Failed to fetch theatres');
  return res.json();
}

export async function getSeatsByShow(showId) {
  const res = await fetch(`${API_BASE}/seats/${showId}`);
  if (!res.ok) throw new Error('Failed to fetch seats');
  return res.json();
}

export async function createBooking(showId, seatIds, paymentMethod) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ showId, seatIds, paymentMethod }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Booking failed');
  return data;
}
