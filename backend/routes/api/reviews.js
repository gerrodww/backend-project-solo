const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');
const { ValidationError } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');


const router = express.Router();

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
});

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId);
  if (!review) return res.status(404).json({ "message": "Review couldn't be found" });
  
  if (review.userId !== req.user.id) return res.status(403).json({ "message": "Forbidden" });

  const imageCount = await ReviewImage.count({ where: { reviewId }});
  if (imageCount >= 10) return res.status(403).json({ "message": "Maximum number of images for this resource was reached" });

  const { url } = req.body;
  const newImage = await ReviewImage.create({
    reviewId,
    url,
  });

  return res.status(200).json({ id: newImage.id, url:newImage.url });
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const reviewId = req.params.reviewId;
  const targetReview = await Review.findByPk(reviewId);
  if (!targetReview) return res.status(404).json({ "message": "Review couldn't be found" });
  
  if (targetReview.userId !== req.user.id) return res.status(403).json({ "message": "Forbidden" });

  const { review, stars } = req.body;

  targetReview.review = review;
  targetReview.stars = stars;

  await targetReview.save();

  return res.status(200).json({ targetReview });
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const targetReview = await Review.findByPk(req.params.reviewId);
  if (!targetReview) return res.status(404).json({ "message": "Review couldn't be found" });

  if (targetReview.userId !== req.user.id) return res.status(403).json({ "message": "Forbidden" });
  
  await ReviewImage.destroy({ where: { reviewId: targetReview.id }});
  await targetReview.destroy();

  return res.status(200).json({ "message": "Successfully deleted" });
})

module.exports = router;