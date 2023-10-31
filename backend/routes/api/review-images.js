const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
  const target = await ReviewImage.findByPk(req.params.imageId);
  if (!target) return res.status(404).json({ "message": "Review Image couldn't be found" });

  const review = await Review.findByPk(target.reviewId);
  if (review.userId === req.user.id) {
    await target.destroy();
    return res.status(200).json({ "message": "Successfully deleted" });
  } else {
    return res.status(403).json({ "message": "Forbidden" });
  }
});

module.exports = router;