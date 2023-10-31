const express = require('express');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

const calculateAvgRating = async spotId => {
  const spot = await Spot.findByPk(spotId, {
    include: {
      model: Review,
      attributes: ['stars'],
    },
  });

  if (!spot) {
    return 0;
  }

  const reviews = spot.Reviews; 

  if (!reviews || reviews.length === 0) {
      return 0; 
    }

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = totalStars / reviews.length;
    return parseFloat(avgRating.toFixed(2));
};

const calculateNumReviews = async spotId => {
  const reviews = await Review.findAll({ 
    where: {
      spotId: spotId,
    }
  });
  return reviews.length;
};

const validateSpot = [
  check("address")
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
  check("city")
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
  check("state")
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
  check("country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required"),
  check("lat")
      .exists({ checkFalsy: true })
      .isDecimal()
      .custom(value => value >= -90 && value <= 90)
      .withMessage("Latitude is not valid"),
  check("lng")
      .exists({ checkFalsy: true })
      .isDecimal()
      .custom(value => value >= -180 && value <= 180)
      .withMessage("Longitude is not valid"),
  check("name")
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage("Name must be less than 50 characters"),
  check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
  check("price")
      .exists({ checkFalsy: true })
      .custom(
          checkPriceIsPositive = value => value > 0)
      .withMessage("Price per day is required"),
  handleValidationErrors
]

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("Stars must be an integer from 1 to 5")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    }
  });

  for (let spot of spots) {
    spot.avgRating = await calculateAvgRating(spot.id);

    const previewImg = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true,
      },
    });

    if (previewImg) {
      spot.previewImage = previewImg.url;
    }
  }

  const responseSpots = spots.map(spot => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.avgRating, 
    previewImage: spot.previewImage, 
  }));

  res.status(200).json({ Spots: responseSpots });

});

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});
  const spotOwnerId = spot.ownerId;
  if (req.user.id !== spotOwnerId) return res.status(403).json({ "message": "Forbidden"});

  const { url, preview } = req.body;
  const spotId = req.params.spotId;

  const newImage = await SpotImage.create({
    spotId: spotId,
    url: url,
    preview: preview
  });

  const imgRes = {};
  imgRes.id = newImage.id;
  imgRes.url = newImage.url;
  imgRes.preview = newImage.preview;

  return res.status(200).json(imgRes);
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});

  if (spot.ownerId === req.user.id) {
    const bookings = await Booking.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    const Bookings = bookings.map((booking) => ({
      User: booking.User,
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return res.status(200).json({ Bookings });
  } else {
    const bookings = await Booking.findAll({
      where: { spotId },
      attributes: ['spotId', 'startDate', 'endDate'],
    });

    const Bookings = bookings.map((booking) => ({
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    return res.status(200).json({ Bookings });
  }
});

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found" });
  const spotId = spot.id;

  const userId = req.user.id;
  if (spot.ownerId === userId) return res.status(403).json({ "message": "Forbidden" });

  if (startDate >= endDate) {
    const err = new Error("Bad request");
    err.title = "Body Validation Error"
    err.errors = { "endDate": "endDate cannot be on or before startDate" }
    err.status = 400;
    return next(err);
  }

  const currentDate = new Date();
  if ((new Date(startDate) || new Date (endDate)) < currentDate) {
    const err = new Error("Bad request");
    err.title = "Body Validation Error"
    err.errors = { "message": "Dates cannot be in the past" }
    err.status = 400;
    return next(err);
  }
  
  const existingBookings = await Booking.findAll({
    where: {
      spotId,
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
        },
      ],
    },
  });

  if (existingBookings.length > 0) {
    const errors = {};

    existingBookings.forEach((booking) => {
      if (booking.startDate.getTime() === new Date(startDate).getTime() && booking.endDate.getTime() === new Date(endDate).getTime()) {
        errors.startDate = 'Start date conflicts with an existing booking';
        errors.endDate = 'End date conflicts with an existing booking';
      } else if (booking.startDate.getTime() === new Date(endDate).getTime()) {
        errors.startDate = 'Start date conflicts with an existing booking';
      } else if (booking.endDate.getTime() === new Date(startDate).getTime()) {
        errors.endDate = 'End date conflicts with an existing booking';
      } else {
        errors.startDate = 'Booking conflicts with existing bookings';
        errors.endDate = 'Booking conflicts with existing bookings';
      }
    });

    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors,
    });
  }

  const newBooking = await Booking.create({ userId, spotId, startDate, endDate });
  return res.status(200).json(newBooking);
});

router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});

  const Reviews = await Review.findAll({ where: {
    spotId: spot.id
    },
    include: [
      { 
        model: User,
        as: "User",
        attributes: [ "id", "firstName", "lastName" ]
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: [ "id", "url" ]
      },
    ],
  });

  return res.status(200).json({ Reviews });
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});
  const existingReview = await Review.findOne({ where: { userId: req.user.id, spotId: req.params.spotId }});
  if (existingReview) return res.status(500).json({ "message": "User already has a review for this spot" });

  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);
  const { review, stars } = req.body;
  const newReview = await Review.create({ userId, spotId, review, stars });
  
  return res.status(201).json({ newReview });
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});

  const spotOwnerId = spot.ownerId;
  if (req.user.id !== spotOwnerId) return res.status(403).json({ "message": "Forbidden"});

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  spot.address = address || spot.address;
  spot.city = city || spot.city;
  spot.state = state || spot.state;
  spot.country = country || spot.country;
  spot.lat = lat || spot.lat;
  spot.lng = lng || spot.lng;
  spot.name = name || spot.name;
  spot.description = description || spot.description;
  spot.price = price || spot.price;
  
  await spot.save();

  const returnSpot = {};
  returnSpot.id = spot.id;
  returnSpot.ownerId = spot.ownerId;
  returnSpot.address = spot.address;
  returnSpot.city = spot.city;
  returnSpot.state = spot.state;
  returnSpot.country = spot.country;
  returnSpot.lat = spot.lat;
  returnSpot.lng = spot.lng;
  returnSpot.name = spot.name;
  returnSpot.description = spot.description;
  returnSpot.price = spot.price;
  returnSpot.createdAt = spot.createdAt;
  returnSpot.updatedAt = spot.updatedAt;

  return res.status(200).json(returnSpot);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
  const target = await Spot.findByPk(req.params.spotId);

  if (!target) return res.status(404).json({ "message": "Spot couldn't be found" });

  const spotOwnerId = target.ownerId;
  if (req.user.id !== spotOwnerId) return res.status(403).json({ "message": "Forbidden" });

  const bookings = await Booking.findAll({ where: { spotId: target.id } });
  const reviews = await Review.findAll({ where: { spotId: target.id } });
  const spotImages = await SpotImage.findAll({ where: { spotId: target.id } });

  // Delete associated bookings
  await Promise.all(bookings.map(async (booking) => await booking.destroy()));

  // Delete associated reviews
  await Promise.all(reviews.map(async (review) => {
    const reviewImages = await ReviewImage.findAll({ where: { reviewId: review.id } });

    // Delete associated review images
    await Promise.all(reviewImages.map(async (reviewImage) => await reviewImage.destroy()));

    await review.destroy();
  }));

  // Delete associated spot images
  await Promise.all(spotImages.map(async (image) => await image.destroy()));

  await target.destroy();

  return res.status(200).json({ "message": "Successfully deleted" });
});

router.get('/:spotId', async(req, res) => {
  const spot = await Spot.findOne({where: { id: req.params.spotId },
    attributes: { exclude: ["previewImage"] }
  });

  if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"});

  spot.avgStarRating = await calculateAvgRating(spot.id);

  spot.SpotImages = await SpotImage.findAll({
    attributes: ['id', 'url', 'preview'],
    where: {
      spotId: spot.id,
    },
  });

  const ownerUser = await User.findByPk(spot.ownerId);

  spot.Owner = {
    id: ownerUser.id,
    firstName: ownerUser.firstName,
    lastName: ownerUser.lastName,
  };

  const spotResponse = {};

  spotResponse.id = spot.id;
  spotResponse.ownerId = spot.ownerId;
  spotResponse.address = spot.address;
  spotResponse.city = spot.city;
  spotResponse.state = spot.state;
  spotResponse.country = spot.country;
  spotResponse.lat = spot.lat;
  spotResponse.lng = spot.lng;
  spotResponse.name = spot.name;
  spotResponse.description = spot.description;
  spotResponse.price = spot.price;
  spotResponse.createdAt = spot.createdAt;
  spotResponse.updatedAt = spot.updatedAt;
  spotResponse.numReviews = await calculateNumReviews(spot.id);
  spotResponse.avgStarRating = spot.avgStarRating;
  spotResponse.SpotImages = spot.SpotImages;
  spotResponse.Owner = spot.Owner;

  return res.status(200).json(spotResponse);
  
});

router.get('/', async (req, res) => {
  const spots = await Spot.findAll();

  for (let spot of spots) {
    spot.avgRating = await calculateAvgRating(spot.id);

    const previewImg = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true,
      },
    });

    if (previewImg) {
      spot.previewImage = previewImg.url;
    }
  }

  const responseSpots = spots.map(spot => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.avgRating, 
    previewImage: spot.previewImage, 
  }));

  res.status(200).json({ Spots: responseSpots });

});

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const ownerId = req.user.id;
  const newSpot = await Spot.create({
    ownerId, address, city, state, country, lat, lng, name, description, price
  });
  
  const returnSpot = {};
  returnSpot.id = newSpot.id;
  returnSpot.ownerId = newSpot.ownerId;
  returnSpot.address = newSpot.address;
  returnSpot.city = newSpot.city;
  returnSpot.state = newSpot.state;
  returnSpot.country = newSpot.country;
  returnSpot.lat = newSpot.lat;
  returnSpot.lng = newSpot.lng;
  returnSpot.name = newSpot.name;
  returnSpot.description = newSpot.description;
  returnSpot.price = newSpot.price;
  returnSpot.createdAt = newSpot.createdAt;
  returnSpot.updatedAt = newSpot.updatedAt;

  return res.status(201).json(returnSpot);
});


module.exports = router;