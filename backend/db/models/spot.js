'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(256)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Spot'
  });
  return Spot;
};