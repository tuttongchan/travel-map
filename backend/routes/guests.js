const router = require('express').Router();
const Guest = require('../models/Guest');

// GUEST
router.post('/', async (req, res) => {
  try {
    const guestUser = new Guest({ guest: req.body.guest });

    const guest = await guestUser.save();
    // Send response
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
