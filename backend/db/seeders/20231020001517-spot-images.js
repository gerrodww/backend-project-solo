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
        url: "https://assets.architecturaldesigns.com/plan_assets/325002687/thumb/86086BW_Render_1561997573.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://cdn.getyourguide.com/img/tour/617996e3f251c.jpeg/145.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://images.discerningassets.com/image/upload/v1628262039/Hobbit_House_3_np4qab.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://t4.ftcdn.net/jpg/03/47/29/29/360_F_347292952_H95fWzKSglfB6qCllbD2CKvBcNyrRVvZ.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://img.freepik.com/premium-photo/camping-cave_445983-2636.jpg",
        preview: true,
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
