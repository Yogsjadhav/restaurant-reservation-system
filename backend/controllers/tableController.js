const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a table (Admin only)
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity } = req.body;

    const table = await Table.create({
      tableNumber,
      capacity
    });

    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a table (Admin only)
// @route   PUT /api/tables/:id
// @access  Private/Admin
const updateTable = async (req, res, next) => {
  try {
    const { capacity, isActive } = req.body;
    
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (capacity !== undefined) table.capacity = capacity;
    if (isActive !== undefined) table.isActive = isActive;

    await table.save();

    res.json(table);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a table (Admin only)
// @route   DELETE /api/tables/:id
// @access  Private/Admin
const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    await table.deleteOne();

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  createTable,
  updateTable,
  deleteTable
};
