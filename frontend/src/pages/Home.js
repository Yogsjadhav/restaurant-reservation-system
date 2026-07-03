import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user, isAdmin } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Welcome to Restaurant Reservations</h1>
        <p className="home-subtitle">Book your table with ease</p>
        
        {user ? (
          <div className="home-actions">
            {isAdmin() ? (
              <>
                <Link to="/admin/reservations" className="home-primary-button">
                  View All Reservations
                </Link>
                <Link to="/admin/tables" className="home-secondary-button">
                  Manage Tables
                </Link>
              </>
            ) : (
              <>
                <Link to="/new-reservation" className="home-primary-button">
                  Make a Reservation
                </Link>
                <Link to="/reservations" className="home-secondary-button">
                  My Reservations
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="home-actions">
            <Link to="/register" className="home-primary-button">
              Get Started
            </Link>
            <Link to="/login" className="home-secondary-button">
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="home-features">
        <div className="home-feature">
          <h3 className="home-feature-title">Easy Booking</h3>
          <p className="home-feature-text">
            Reserve your table in just a few clicks
          </p>
        </div>
        <div className="home-feature">
          <h3 className="home-feature-title">Real-time Availability</h3>
          <p className="home-feature-text">
            See available time slots instantly
          </p>
        </div>
        <div className="home-feature">
          <h3 className="home-feature-title">Manage Bookings</h3>
          <p className="home-feature-text">
            View and cancel your reservations anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
