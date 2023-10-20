'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 9,
        userId: 3,
        startDate: new Date('2023-11-01'),
        endDate: new Date('2023-11-10')
      },
      {
        spotId: 8,
        userId: 4,
        startDate: new Date('2023-12-20'),
        endDate: new Date('2024-01-05')
      },
      {
        spotId: 7,
        userId: 5,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        spotId: 6,
        userId: 1,
        startDate: new Date('2023-11-15'),
        endDate: new Date('2023-12-15')
      },
      {
        spotId: 4,
        userId: 2,
        startDate: new Date('2023-12-01'),
        endDate: new Date('2023-12-31')
      },
      {
        spotId: 5,
        userId: 7,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-05')
      },
      {
        spotId: 3,
        userId: 6,
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-05-01')
      },
      {
        spotId: 2,
        userId: 8,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-05-06')
      },
      {
        spotId: 1,
        userId: 9,
        startDate: new Date('2024-09-18'),
        endDate: new Date('2026-09-18')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
    }, {});
  }
};
