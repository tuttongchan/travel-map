const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema(
  {
    guest: {
      type: String,
      default: 'Guest',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', GuestSchema);
