import { useState, useEffect } from 'react';
import { reservationService } from '../services/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [filterDate, filterStatus]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;

      const response = await reservationService.getAllReservations(params);
      console.log('Admin Reservations Data:', response.data);
      setReservations(response.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'admin-reservations-badge admin-reservations-badge-confirmed';
      case 'cancelled':
        return 'admin-reservations-badge admin-reservations-badge-cancelled';
      default:
        return 'admin-reservations-badge admin-reservations-badge-default';
    }
  };

  const groupByDate = (reservations) => {
    const grouped = {};
    reservations.forEach(reservation => {
      const date = new Date(reservation.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(reservation);
    });
    return grouped;
  };

  const groupedReservations = groupByDate(reservations);

  if (loading) {
    return <div className="admin-reservations-loading">Loading...</div>;
  }

  return (
    <div className="admin-reservations-container">
      <h2 className="admin-reservations-title">All Reservations</h2>
      
      {error && <div className="admin-reservations-error">{error}</div>}
      
      <div className="admin-reservations-filters">
        <div className="admin-reservations-filter-group">
          <label className="admin-reservations-label">Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="admin-reservations-input"
          />
        </div>
        
        <div className="admin-reservations-filter-group">
          <label className="admin-reservations-label">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-reservations-select"
          >
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {(filterDate || filterStatus) && (
          <button
            onClick={() => {
              setFilterDate('');
              setFilterStatus('');
            }}
            className="admin-reservations-clear-button"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {reservations.length === 0 ? (
        <div className="admin-reservations-no-data">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="admin-reservations-content">
          {Object.entries(groupedReservations).map(([date, dateReservations]) => (
            <div key={date} className="admin-reservations-date-group">
              <h3 className="admin-reservations-date-header">{date}</h3>
              <div className="admin-reservations-table-wrapper">
                <table className="admin-reservations-table">
                  <thead>
                    <tr>
                      <th className="admin-reservations-th">Booking ID</th>
                      <th className="admin-reservations-th">Time Slot</th>
                      <th className="admin-reservations-th">Customer Name</th>
                      <th className="admin-reservations-th">Customer Email</th>
                      <th className="admin-reservations-th">Guests</th>
                      <th className="admin-reservations-th">Table</th>
                      <th className="admin-reservations-th">Status</th>
                      <th className="admin-reservations-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateReservations.map((reservation) => (
                      <tr key={reservation._id} className="admin-reservations-tr">
                        <td className="admin-reservations-td">
                          <code style={{ fontSize: '0.75rem', color: '#8d99ae' }}>
                            {reservation._id.slice(-8)}
                          </code>
                        </td>
                        <td className="admin-reservations-td">{reservation.timeSlot}</td>
                        <td className="admin-reservations-td">
                          {reservation.customerName || reservation.user?.name || 'N/A'}
                        </td>
                        <td className="admin-reservations-td">
                          {reservation.customerEmail || reservation.user?.email || 'N/A'}
                        </td>
                        <td className="admin-reservations-td">{reservation.numberOfGuests}</td>
                        <td className="admin-reservations-td">
                          Table {reservation.table.tableNumber}
                        </td>
                        <td className="admin-reservations-td">
                          <span className={getStatusClass(reservation.status)}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="admin-reservations-td">
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancel(reservation._id)}
                              className="admin-reservations-cancel-button"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
