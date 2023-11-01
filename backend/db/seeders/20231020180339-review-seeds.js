'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        review: "I don't like swimming where is Frodo",
        stars: 2,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Starfall is beautiful and the High Lady reminds me of my queen",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 4,
        review: "Always nice to visit the hobbits",
        stars: 5,
      },
      {
        spotId: 4,
        userId: 2,
        review: "Only visit this dungeon if your will is strong",
        stars: 3,
      },
      {
        spotId: 5,
        userId: 3,
        review: "This cave is cozy. There are no trolls.",
        stars: 4,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5 ] }
    }, {});
  }
};
