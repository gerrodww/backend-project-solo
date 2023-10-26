const express = require('express');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

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
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found"});
  const spotOwnerId = spot.ownerId;
  if (req.user.id !== spotOwnerId) return res.status(403).json({ message: "Forbidden"});

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

router.get('/:spotId', async(req, res) => {
  const spot = await Spot.findOne({where: { id: req.params.spotId },
    attributes: { exclude: ["previewImage"] }
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found"});

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