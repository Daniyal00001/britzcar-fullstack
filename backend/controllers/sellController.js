const SellCar = require('../models/SellCar');
exports.getAll = async (req, res) => {
  const rows = await SellCar.find().sort({ createdAt: -1 });
  res.json(rows);
};
exports.create = async (req, res) => {
  const row = new SellCar(req.body);
  await row.save();
  res.json({ message: 'Sell request submitted', row });
};
exports.update = async (req, res) => {
  const row = await SellCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(row);
};
exports.remove = async (req, res) => {
  await SellCar.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sell request deleted' });
};
