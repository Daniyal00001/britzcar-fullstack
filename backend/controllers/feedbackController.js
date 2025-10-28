const Feedback = require('../models/Feedback');
exports.getAll = async (req, res) => {
  const rows = await Feedback.find().sort({ createdAt: -1 });
  res.json(rows);
};
exports.create = async (req, res) => {
  const row = new Feedback(req.body);
  await row.save();
  res.json({ message: 'Feedback received', row });
};
exports.remove = async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: 'Feedback deleted' });
};
