const Order = require('../models/Order');
const Book = require('../models/Book');

exports.create = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;
    
    // Validate inventory before creating order
    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${item.book} not found` });
      }
      
      if (book.inventory < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient inventory for "${book.title}". Available: ${book.inventory}, Requested: ${item.quantity}` 
        });
      }
    }
    
    // Create order
    const order = await Order.create({ user: req.user?._id, items, totalAmount, status: 'Paid' });
    
    // Deduct inventory after successful order creation
    for (const item of items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { inventory: -item.quantity } },
        { new: true }
      );
    }
    
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

exports.cancel = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if order can be cancelled (only pending or paid orders)
    if (!['Pending', 'Paid'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled in current status' });
    }
    
    // Restore inventory
    for (const item of order.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { inventory: item.quantity } },
        { new: true }
      );
    }
    
    // Update order status
    order.status = 'Cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) { next(err); }
};

