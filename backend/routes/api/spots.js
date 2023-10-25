const express = require('express');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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


module.exports = router;