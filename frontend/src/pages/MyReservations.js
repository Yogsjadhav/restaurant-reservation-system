import { useState, useEffect } from 'react';
import { reservationService } from '../services/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getMyReservations();
      setReservations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reservations');
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'my-reservations-badge my-reservations-badge-confirmed';
      case 'cancelled':
        return 'my-reservations-badge my-reservations-badge-cancelled';
      default:
        return 'my-reservations-badge my-reservations-badge-default';
    }
  };

  if (loading) {
    return <div className="my-reservations-loading">Loading...</div>;
  }

  return (
    <div className="my-reservations-container">
      <h2 className="my-reservations-title">My Reservations</h2>
      
      {error && <div className="my-reservations-error">{error}</div>}
      
      {reservations.length === 0 ? (
        <div className="my-reservations-no-data">
          <p>You don't have any reservations yet.</p>
        </div>
      ) : (
        <div className="my-reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="my-reservations-card">
              <div className="my-reservations-card-header">
                <span className={getStatusClass(reservation.status)}>
                  {reservation.status}
                </span>
              </div>
              
              <div className="my-reservations-card-body">
                <div className="my-reservations-info-row">
                  <strong>Date:</strong> {formatDate(reservation.date)}
                </div>
                <div className="my-reservations-info-row">
                  <strong>Time:</strong> {reservation.timeSlot}
                </div>
                <div className="my-reservations-info-row">
                  <strong>Guests:</strong> {reservation.numberOfGuests}
                </div>
                <div className="my-reservations-info-row">
                  <strong>Table:</strong> Table {reservation.table.tableNumber} (Capacity: {reservation.table.capacity})
                </div>
              </div>
              
              {reservation.status === 'confirmed' && (
                <div className="my-reservations-card-footer">
                  <button
                    onClick={() => handleCancel(reservation._id)}
                    className="my-reservations-cancel-button"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
