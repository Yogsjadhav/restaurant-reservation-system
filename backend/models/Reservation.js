const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '11:00-13:00',
      '13:00-15:00',
      '15:00-17:00',
      '17:00-19:00',
      '19:00-21:00',
      '21:00-23:00'
    ]
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Number of guests must be at least 1']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required']
  }
}, {
  timestamps: true
});

// Index for efficient queries
reservationSchema.index({ table: 1, date: 1, timeSlot: 1 });
reservationSchema.index({ user: 1 });
reservationSchema.index({ date: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
