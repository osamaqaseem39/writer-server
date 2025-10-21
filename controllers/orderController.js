const Order = require('../models/Order');

exports.create = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;
    const order = await Order.create({ user: req.user?._id, items, totalAmount, status: 'Paid' });
    res.status(201).json({ order });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query).populate('items.book').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.book');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ order });
  } catch (err) { next(err); }
};

