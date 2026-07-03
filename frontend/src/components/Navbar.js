import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Restaurant Reservations
        </Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <span className="navbar-welcome">Welcome, {user.name}</span>
              {isAdmin() && (
                <span className="navbar-badge">Admin</span>
              )}
              {isAdmin() ? (
                <>
                  <Link to="/admin/reservations" className="navbar-link">
                    All Reservations
                  </Link>
                  <Link to="/admin/tables" className="navbar-link">
                    Manage Tables
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/reservations" className="navbar-link">
                    My Reservations
                  </Link>
                  <Link to="/new-reservation" className="navbar-link">
                    New Reservation
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
