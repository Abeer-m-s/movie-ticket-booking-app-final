import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        ANIMOV
      </Link>
      <div className="nav-actions">
        {user ? (
          <div className="nav-user">
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">
                ADMIN
              </Link>
            )}
            <Link to="/my-bookings" className="nav-link">
              MY TICKETS
            </Link>
            <span className="nav-username">Hi, {user.role}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-login">LOGIN</Link>
        )}
      </div>
    </nav>
  );
}
