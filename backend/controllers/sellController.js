const SellCar = require('../models/SellCar');
exports.getAll = async (req, res) => {
  console.log('Fetching all sell requests');
  const rows = await SellCar.find().sort({ createdAt: -1 });
  res.json(rows);
};
exports.create = async (req, res) => {
  console.log('Creating sell request');
  const row = new SellCar(req.body);
  await row.save();
  res.json({ message: 'Sell request submitted', row });
};
exports.update = async (req, res) => {
  console.log('Updating sell request');
  const row = await SellCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(row);
};
exports.remove = async (req, res) => {
  console.log('Deleting sell request');
  await SellCar.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sell request deleted' });
};
