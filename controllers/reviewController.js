const { validationResult } = require('express-validator');
const Review = require('../models/Review');

exports.list = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { approved: true };
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

