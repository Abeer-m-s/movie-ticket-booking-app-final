const API_BASE = 'https://movie-ticket-booking-app-final.onrender.com/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text(); // get raw response
    throw new Error(text || 'Login failed');
  }

  return res.json();
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

export async function getMyBookings() {
  const res = await fetch(`${API_BASE}/bookings/my`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
  return data;
}

// ======== ADMIN APIs ========

export async function createMovie(movie) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(movie),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create movie');
  return data;
}

export async function createTheatre(theatre) {
  const res = await fetch(`${API_BASE}/theatres`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(theatre),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create theatre');
  return data;
}

export async function checkAdmin() {
  const res = await fetch(`${API_BASE}/admin/check-admin`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Not authorized as admin');
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

// ======== ADMIN EXTRA ========

export async function updateMovie(id, movie) {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(movie),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update movie');
  return data;
}

export async function getAllBookingsAdmin() {
  const res = await fetch(`${API_BASE}/admin/bookings`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
  return data;
}
