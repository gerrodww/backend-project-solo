const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');


const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const reviews = await Review.findAll({ where: {userId: userId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        as: "Spot",
        attributes: ["id", "ownerId", "address", "city", "state", "country", 
        "lat", "lng", "name", "price"],
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: ["id", "url"],
      }
    ]
  });

  const Reviews = await Promise.all(reviews.map( async (review) => {
    const spot = { ...review.Spot.get() }; 
    const previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
    });
  
    if (previewImage) {
      spot.previewImage = previewImage.url;
    }
  
    return {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: review.User,
      Spot: spot, 
      ReviewImages: review.ReviewImages,
    };
  }));

  return res.status(200).json({ Reviews });
})



module.exports = router;