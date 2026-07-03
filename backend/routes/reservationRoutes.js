const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
  getAvailableSlots
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/auth');

// Customer routes
router.post('/', protect, createReservation);
router.get('/my-reservations', protect, getMyReservations);
router.delete('/:id', protect, cancelReservation);
router.get('/available-slots', protect, getAvailableSlots);

// Admin routes
router.get('/admin/all', protect, admin, getAllReservations);
router.put('/admin/:id', protect, admin, updateReservation);

module.exports = router;
