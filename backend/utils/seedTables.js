const Table = require('../models/Table');

const seedTables = async () => {
  try {
    const count = await Table.countDocuments();
    
    if (count === 0) {
      const tables = [
        { tableNumber: 1, capacity: 2 },
        { tableNumber: 2, capacity: 2 },
        { tableNumber: 3, capacity: 4 },
        { tableNumber: 4, capacity: 4 },
        { tableNumber: 5, capacity: 4 },
        { tableNumber: 6, capacity: 6 },
        { tableNumber: 7, capacity: 6 },
        { tableNumber: 8, capacity: 8 },
      ];

      await Table.insertMany(tables);
      console.log('Tables seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding tables:', error);
  }
};

module.exports = seedTables;
