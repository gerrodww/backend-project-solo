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
        review: "Amazing loft in NYC and the owner knew magic",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 5,
        review: "The building was too tall and infested with mages",
        stars: 2,
      },
      {
        spotId: 2,
        userId: 1,
        review: "Awesome amazing villa 5/5",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 1,
        review: "Terrible cheap hovel",
        stars: 1,
      },
      {
        spotId: 3,
        userId: 6,
        review: "Nice condo on the beach, no vampires",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: "This condo is unworthy of the reaper",
        stars: 1,
      },
      {
        spotId: 4,
        userId: 6,
        review: "Nice ryokan in the heart of Tokyo, no vampires",
        stars: 4,
      },
      {
        spotId: 4,
        userId: 7,
        review: "Not as nice as my properties and no other wizards",
        stars: 1,
      },
      {
        spotId: 5,
        userId: 1,
        review: "Just kept swimming until I found this place",
        stars: 5,
      },
      {
        spotId: 5,
        userId: 3,
        review: "I do not like to swim. Where is Frodo?",
        stars: 1,
      },
      {
        spotId: 6,
        userId: 2,
        review: "Nice home with capable warriors",
        stars: 5,
      },
      {
        spotId: 6,
        userId: 3,
        review: "Nice place to train with the Illyrians",
        stars: 5,
      },
      {
        spotId: 7,
        userId: 4,
        review: "Always nice to visit the Shire",
        stars: 5,
      },
      {
        spotId: 7,
        userId: 5,
        review: "Plenty of food and ale",
        stars: 5,
      },
      {
        spotId: 8,
        userId: 8,
        review: "I thought I would like staying in a dungeon but I do not.",
        stars: 1,
      },
      {
        spotId: 8,
        userId: 7,
        review: "This is a literal dungeon don't come here",
        stars: 1,
      },
      {
        spotId: 9,
        userId: 2,
        review: "Actually pretty cozy, but still a cave",
        stars: 3,
      },
      {
        spotId: 9,
        userId: 7,
        review: "Lots of vampires",
        stars: 5,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};
