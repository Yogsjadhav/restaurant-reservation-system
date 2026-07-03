const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// desc Create a new reservation
// route POST /api/reservations

const createReservation = async (req, res, next) => {
  try {
    const { date, timeSlot, numberOfGuests, tableId } = req.body;

    // Validate required fields
    if (!date || !timeSlot || !numberOfGuests) {
      return res.status(400).json({ message: 'Date, time slot, and number of guests are required' });
    }

    // Parse and validate date
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return res.status(400).json({ message: 'Cannot make reservations for past dates' });
    }

    // Find suitable table if not specified
    let table;
    if (tableId) {
      table = await Table.findById(tableId);
      if (!table || !table.isActive) {
        return res.status(404).json({ message: 'Table not found or inactive' });
      }
      if (table.capacity < numberOfGuests) {
        return res.status(400).json({ message: `Table capacity (${table.capacity}) is less than number of guests (${numberOfGuests})` });
      }
    } else {
      // Find available table with sufficient capacity
      table = await findAvailableTable(reservationDate, timeSlot, numberOfGuests);
      if (!table) {
        return res.status(400).json({ message: 'No available tables for the specified date, time, and number of guests' });
      }
    }

    // Check for existing reservation
    const existingReservation = await Reservation.findOne({
      table: table._id,
      date: reservationDate,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'This table is already reserved for the selected date and time slot' });
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user._id,
      table: table._id,
      date: reservationDate,
      timeSlot,
      numberOfGuests,
      customerName: req.user.name,
      customerEmail: req.user.email
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email');

    res.status(201).json(populatedReservation);
  } catch (error) {
    next(error);
  }
};

// Helper function to find available table
const findAvailableTable = async (date, timeSlot, numberOfGuests) => {
  // Get all active tables with sufficient capacity
  const tables = await Table.find({
    isActive: true,
    capacity: { $gte: numberOfGuests }
  }).sort({ capacity: 1 }); // Sort by capacity ascending to optimize table usage

  // Check each table for availability
  for (const table of tables) {
    const existingReservation = await Reservation.findOne({
      table: table._id,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (!existingReservation) {
      return table;
    }
  }

  return null;
};

// @desc    Get user's own reservations
// @route   GET /api/reservations/my-reservations
// @access  Private
const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort({ date: -1, timeSlot: 1 });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel own reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns the reservation or is admin
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations (Admin only)
// @route   GET /api/reservations/admin/all
// @access  Private/Admin
const getAllReservations = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const query = {};

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }

    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email')
      .sort({ date: -1, timeSlot: 1 });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation (Admin only)
// @route   PUT /api/reservations/admin/:id
// @access  Private/Admin
const updateReservation = async (req, res, next) => {
  try {
    const { date, timeSlot, numberOfGuests, tableId, status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // If changing table, date, or time, check for conflicts
    if ((tableId && tableId !== reservation.table.toString()) || 
        (date && new Date(date).getTime() !== reservation.date.getTime()) || 
        (timeSlot && timeSlot !== reservation.timeSlot)) {
      
      const checkDate = date ? new Date(date) : reservation.date;
      checkDate.setHours(0, 0, 0, 0);
      
      const checkTimeSlot = timeSlot || reservation.timeSlot;
      const checkTableId = tableId || reservation.table;

      const conflict = await Reservation.findOne({
        _id: { $ne: reservation._id },
        table: checkTableId,
        date: checkDate,
        timeSlot: checkTimeSlot,
        status: { $ne: 'cancelled' }
      });

      if (conflict) {
        return res.status(400).json({ message: 'This table is already reserved for the selected date and time slot' });
      }
    }

    // Update fields
    if (date) reservation.date = new Date(date);
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (numberOfGuests) reservation.numberOfGuests = numberOfGuests;
    if (tableId) reservation.table = tableId;
    if (status) reservation.status = status;

    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email');

    res.json(updatedReservation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a date
// @route   GET /api/reservations/available-slots
// @access  Private
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, numberOfGuests } = req.query;

    if (!date || !numberOfGuests) {
      return res.status(400).json({ message: 'Date and number of guests are required' });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const timeSlots = [
      '11:00-13:00',
      '13:00-15:00',
      '15:00-17:00',
      '17:00-19:00',
      '19:00-21:00',
      '21:00-23:00'
    ];

    const availableSlots = [];

    for (const slot of timeSlots) {
      const availableTable = await findAvailableTable(queryDate, slot, parseInt(numberOfGuests));
      if (availableTable) {
        availableSlots.push({
          timeSlot: slot,
          available: true,
          tableNumber: availableTable.tableNumber,
          tableCapacity: availableTable.capacity
        });
      }
    }

    res.json(availableSlots);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
  getAvailableSlots
};
