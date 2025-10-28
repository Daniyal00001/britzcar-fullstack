const mongoose = require('mongoose');
const sellCarSchema = new mongoose.Schema({
  sellerName: String,
  contact: String,
  email: String,
  make: String,
  model: String,
  year: Number,
  mileage: Number,
  color: String,
  expectedPrice: Number,
  notes: String,
  images: [String],
  status: { type: String, default: 'pending' } // pending/approved/rejected
}, { timestamps: true });
module.exports = mongoose.model('SellCar', sellCarSchema);
