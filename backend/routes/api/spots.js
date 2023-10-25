const express = require('express');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');

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

router.get('/current', async (req, res) => {

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