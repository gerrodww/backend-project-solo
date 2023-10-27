const express = require('express');
const { Booking, Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const bookings = await Booking.findAll({ 
    where: { userId },
    include: {
      model: Spot,
      as: 'Spot',
      attributes: [
        'id', 'ownerId', 'address', 'city',
        'state', 'country', 'lat', 'lng', 'name', 'price',
      ],
    },
  });

  const Bookings = await Promise.all(bookings.map( async (booking) => {
    const spot = { ...booking.Spot.get() };
    const previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
    });

    if (previewImage) {
      spot.previewImage = previewImage.url;
    }

    return {
      id: booking.id,
      spotId: booking.spotId,
      Spot: spot,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }
  }));
  
  return res.status(200).json({ Bookings });
});


module.exports = router;