const router = require('express').Router();
const mongoose = require('mongoose');
const Pin = require('../models/Pin');

// create a pin
router.post('/', async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all pins
router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a pin
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await Pin.findByIdAndRemove(userId);
    res.json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.json(500).json(err);
  }
});

module.exports = router;
