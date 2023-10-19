'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: "Demo",
        lastName: "User"
      },
      {
        email: 'user1@user.io',
        username: 'Reaper',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: "Darrow",
        lastName: "O'Lykkos"
      },
      {
        email: 'user2@user.io',
        username: 'WolfoftheNorth',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Aedion",
        lastName: "Ashryver"
      },
      {
        email: 'sonofgondor@user.io',
        username: 'ElfStone',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: "Aragorn",
        lastName: "Elessar"
      },
      {
        email: 'woodlandrealm@user.io',
        username: 'PrinceoftheWood',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: "Legolas",
        lastName: "Greenleaf"
      },
      {
        email: 'vampireslayer@user.io',
        username: 'Goldilocks',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: "Buffy",
        lastName: "Summers"
      },
      {
        email: 'hermionejean@user.io',
        username: 'Hermy',
        hashedPassword: bcrypt.hashSync('password7'),
        firstName: "Hermione",
        lastName: "Granger"
      },
      {
        email: 'highqueen@user.io',
        username: 'QueenJude',
        hashedPassword: bcrypt.hashSync('password8'),
        firstName: "Jude",
        lastName: "Duarte"
      },
      {
        email: 'gerrodww@user.io',
        username: 'gerrodww',
        hashedPassword: bcrypt.hashSync('password9'),
        firstName: "Gerrod",
        lastName: "White"
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'Reaper', 'WolfoftheNorth', 'ElfStone', 'PrinceoftheWood',
      'Goldilocks', 'Hermy', 'QueenJude', 'gerrodww'] }
    }, {});
  }
};
