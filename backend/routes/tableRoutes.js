const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getTables);
router.post('/', protect, admin, createTable);
router.put('/:id', protect, admin, updateTable);
router.delete('/:id', protect, admin, deleteTable);

module.exports = router;
