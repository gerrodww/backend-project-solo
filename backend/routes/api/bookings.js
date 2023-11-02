const express = require('express');
const { Booking, Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

router.put('/:bookingId', requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) return res.status(404).json({ "message": "Booking couldn't be found" });
  if (booking.userId !== req.user.id) return res.status(403).json({ "message": "Forbidden"});

  if (new Date(booking.endDate) <= new Date()) {
    return res.status(403).json({ "message": "Past bookings can't be modified" });
  }

  if (startDate >= endDate) {
    const err = new Error("Bad request");
    err.errors = { "endDate": "endDate cannot come before startDate" }
    err.status = 400;
    return next(err);
  }

  const currentDate = new Date();
  if ((new Date(startDate) || new Date (endDate)) < currentDate) {
    return res.status(403).json({ "message": "Past bookings can't be modified" })
  }

  const existingBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId, 
      [Op.or]: [
        {
          [Op.and]: [
            { startDate: { [Op.lte]: endDate } },
            { endDate: { [Op.gte]: startDate } },
          ],
        },
        {
          [Op.or]: [
            { startDate: { [Op.eq]: endDate } },
            { endDate: { [Op.eq]: startDate } },
          ],
        },
        {
          [Op.and]: [
            { startDate: { [Op.gte]: new Date(startDate) } },
            { startDate: { [Op.lte]: new Date(endDate) } },
          ],
        },
        {
          [Op.and]: [
            { endDate: { [Op.gte]: new Date(startDate) } },
            { endDate: { [Op.lte]: new Date(endDate) } },
          ],
        }
      ],
      id: { [Op.ne]: booking.id },
    },
  });

  if (existingBookings.length > 0) {
    const errors = {
      startDate: 'Start date conflicts with an existing booking',
      endDate: 'End date conflicts with an existing booking',
    };

    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors,
    });
  }

  booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.status(200).json(booking);
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const target = await Booking.findByPk(req.params.bookingId);
  if (!target) return res.status(404).json({ "message": "Booking couldn't be found" });

  const spot = await Spot.findByPk(target.spotId);
  if ((target.userId !== req.user.id) && (spot.ownerId !== req.user.id)) {
    return res.status(403).json({ "message": "Forbidden" });
  }

  if (new Date(target.startDate) <= new Date()) {
    return res.status(403).json({ "message": "Bookings that have been started can't be deleted" });
  }

  await target.destroy();
  return res.status(200).json({ "message": "Successfully deleted" });
});


module.exports = router;