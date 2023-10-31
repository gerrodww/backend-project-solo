const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
  const target = await SpotImage.findByPk(req.params.imageId);
  if (!target) return res.status(404).json({ "message": "Spot Image couldn't be found" });

  const spot = await Spot.findByPk(target.spotId);
  if (spot.ownerId === req.user.id) {
    await target.destroy();
    return res.status(200).json({ "message": "Successfully deleted" });
  } else {
    return res.status(403).json({ "message": "Forbidden" });
  }
});

module.exports = router;