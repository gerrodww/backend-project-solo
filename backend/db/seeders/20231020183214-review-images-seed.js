'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "swimmingelfimage.url"
      },
      {
        reviewId: 2,
        url: "nightcourtimage.url"
      },
      {
        reviewId: 3,
        url: "happyhobbitimage.url"
      },
      {
        reviewId: 4,
        url: "dungeonreviewimage.url"
      },
      {
        reviewId: 5,
        url: "cozycaveimage.url"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [ 1, 2, 3, 4, 5 ] }
    }, {});
  }
};
