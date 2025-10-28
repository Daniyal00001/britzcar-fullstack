const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({
  name: String,
  make: String,
  model: String,
  price: Number,
  year: Number,
  mileage: Number,
  fuel: String,
  transmission: String,
  engine: String,
  color: String,
  owners: Number,
  condition: Number,
  bodyStyle: String,
  details: String,
  images: [String]
}, { timestamps: true });
module.exports = mongoose.model('Car', carSchema);
