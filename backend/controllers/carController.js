const Car = require('../models/Car');
exports.getCars = async (req, res) => {
  const cars = await Car.find().sort({ createdAt: -1 });
  res.json(cars);
};
exports.getCarById = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if(!car) return res.status(404).json({ message: 'Not found' });
  res.json(car);
};
exports.addCar = async (req, res) => {
  const car = new Car(req.body);
  await car.save();
  res.json({ message: 'Car added', car });
};
exports.updateCar = async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(car);
};
exports.deleteCar = async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: 'Car deleted' });
};
