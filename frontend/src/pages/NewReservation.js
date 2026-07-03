import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../services/api';

const NewReservation = () => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    numberOfGuests: 2
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const navigate = useNavigate();

  const timeSlots = [
    '11:00-13:00',
    '13:00-15:00',
    '15:00-17:00',
    '17:00-19:00',
    '19:00-21:00',
    '21:00-23:00'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.numberOfGuests) {
      return;
    }

    setCheckingAvailability(true);
    setError('');

    try {
      const response = await reservationService.getAvailableSlots({
        date: formData.date,
        numberOfGuests: formData.numberOfGuests
      });
      setAvailableSlots(response.data);
      
      if (response.data.length === 0) {
        setError('No tables available for the selected date and number of guests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability');
    }

    setCheckingAvailability(false);
  };

  useEffect(() => {
    if (formData.date && formData.numberOfGuests) {
      checkAvailability();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date, formData.numberOfGuests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await reservationService.createReservation(formData);
      setSuccess('Reservation created successfully!');
      
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    }

    setLoading(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isSlotAvailable = (slot) => {
    return availableSlots.some(s => s.timeSlot === slot);
  };

  return (
    <div className="reservation-container">
      <div className="reservation-form-wrapper">
        <h2 className="reservation-title">Make a Reservation</h2>
        
        {error && <div className="reservation-error">{error}</div>}
        {success && <div className="reservation-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="reservation-form-group">
            <label className="reservation-label">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getTodayDate()}
              required
              className="reservation-input"
            />
          </div>

          <div className="reservation-form-group">
            <label className="reservation-label">Number of Guests *</label>
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              min="1"
              max="10"
              required
              className="reservation-input"
            />
          </div>

          {checkingAvailability && (
            <div className="reservation-info">Checking availability...</div>
          )}

          {!checkingAvailability && availableSlots.length > 0 && (
            <div className="reservation-form-group">
              <label className="reservation-label">Available Time Slots *</label>
              <div className="reservation-slot-grid">
                {availableSlots.map((slot) => (
                  <label
                    key={slot.timeSlot}
                    className={`reservation-slot-label ${formData.timeSlot === slot.timeSlot ? 'reservation-slot-label-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.timeSlot}
                      checked={formData.timeSlot === slot.timeSlot}
                      onChange={handleChange}
                      required
                      className="reservation-radio"
                    />
                    <div>
                      <div>{slot.timeSlot}</div>
                      <div className="reservation-slot-info">
                        Table {slot.tableNumber} (Capacity: {slot.tableCapacity})
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || availableSlots.length === 0 || !formData.timeSlot}
            className="reservation-button"
          >
            {loading ? 'Creating...' : 'Create Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewReservation;
