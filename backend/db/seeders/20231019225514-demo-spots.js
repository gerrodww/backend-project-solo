'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "42 Wallaby Way",
        city: "Sydney",
        state: "Sydney",
        country: "Australia",
        lat: 27.1996,
        lng: -50.1026,
        name: "P. Sherman",
        description: "Just keep swimming",
        price: 205.50
      },
      {
        ownerId: 1,
        address: "7 Cobble Dr",
        city: "Velaris",
        state: "Night Court",
        country: "Prythian",
        lat: 45.1234,
        lng: -33.9876,
        name: "Starfall View Loft",
        description: "Live among the stars in the city of Starlight",
        price: 2500.99
      },
      {
        ownerId: 1,
        address: "15 Hobbiton Lane",
        city: "The Shire",
        state: "Green Hills",
        country: "Middle Earth",
        lat: -37.8103,
        lng: 175.7762,
        name: "Hobbit Haven",
        description: "A peaceful retreat in the heart of the Shire, safe from the tall folk.",
        price: 75.00
      },
      {
        ownerId: 1,
        address: "13 Dungeon Rd",
        city: "Cryptville",
        state: "Darkness",
        country: "Nether",
        lat: -66.6666,
        lng: 66.7777,
        name: "Dungeon of Darkness",
        description: "Spend your time in despair in this dark and depraved dungeon",
        price: 999.99
      },
      {
        ownerId: 1,
        address: "7 Stone Cave Dr",
        city: "Mystictown",
        state: "Mystica",
        country: "Fanastica",
        lat: 42.0000,
        lng: -71.0000,
        name: "Cozy Cave Hideout",
        description: "Experience the stone age in this unique cave stay.",
        price: 1.00
      },
    ], { validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        "P. Sherman",
        "Starfall View Loft",
        "Hobbit Haven",
        "Dungeon of Darkness",
        "Cozy Cave Hideout"
      ] }
    }, {});
  }
};
