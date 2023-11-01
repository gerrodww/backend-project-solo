'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "wallabywayimage.url",
        preview: true,
      },
      {
        spotId: 2,
        url: "starfallimage.url",
        preview: true,
      },
      {
        spotId: 3,
        url: "shireimage.url",
        preview: true,
      },
      {
        spotId: 4,
        url: "dungeonimage.url",
        preview: true,
      },
      {
        spotId: 5,
        url: "caveimage.url",
        preview: false,
      },
    ], { validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3, 4, 5 ] }
    }, {});
  }
};
