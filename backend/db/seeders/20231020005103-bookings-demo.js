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
        spotId: 1,
        userId: 3,
        startDate: new Date('2023-11-01'),
        endDate: new Date('2023-11-10')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-12-20'),
        endDate: new Date('2024-01-05')
      },
      {
        spotId: 3,
        userId: 4,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        spotId: 4,
        userId: 2,
        startDate: new Date('2023-11-15'),
        endDate: new Date('2023-12-15')
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2023-12-01'),
        endDate: new Date('2023-12-31')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3, 4, 5 ] }
    }, {});
  }
};
