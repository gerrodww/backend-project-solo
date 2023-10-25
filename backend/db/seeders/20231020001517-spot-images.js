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
        url: "https://media.istockphoto.com/id/172927436/photo/cast-iron-buildings-in-soho-new-york-city.jpg?s=2048x2048&w=is&k=20&c=TPTtxLWShQvnUHETiy1S5jpcNsvNC03S8vO9qtFg-A8=",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://www.flickr.com/photos/wwarby/34701989990/",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://www.flickr.com/photos/wallyg/6644520555/",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://www.flickr.com/photos/marco_capitanio/8821737566/",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://www.flickr.com/photos/davdenic/20772765664/",
        preview: false,
      },
      {
        spotId: 6,
        url: "https://www.flickr.com/photos/aerugino/14391440891/",
        preview: false,
      },
      {
        spotId: 7,
        url: "https://www.flickr.com/photos/robertmoranelli/52659704231/",
        preview: false,
      },
      {
        spotId: 8,
        url: "https://www.flickr.com/photos/naeemacampbell/4544608043/",
        preview: false,
      },
      {
        spotId: 9,
        url: "https://www.flickr.com/photos/sallysherwood/7620321790/",
        preview: false,
      },
    ], { validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
    }, {});
  }
};
