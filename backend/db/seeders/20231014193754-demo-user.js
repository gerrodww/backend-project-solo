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
        email: 'goldenson@user.io',
        username: 'Reaper',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: "Darrow",
        lastName: "O'Lykkos"
      },
      {
        email: 'northernwolf@user.io',
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
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Reaper', 'WolfoftheNorth', 'ElfStone', 'PrinceoftheWood',] }
    }, {});
  }
};
