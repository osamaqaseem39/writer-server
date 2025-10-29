const Order = require('../models/Order');
const Book = require('../models/Book');
const { sendOrderNotificationEmail } = require('../utils/email');

// Calculate shipping charges based on country
function calculateShippingCharges(country, subtotal) {
  // Pakistan: Free shipping for orders above 2500, otherwise 500
  if (country === 'PK' || country === 'Pakistan') {
    return subtotal > 2500 ? 0 : 500;
  }
  // International: Add shipping charges (2000 PKR or equivalent)
  return 2000;
}

exports.create = async (req, res, next) => {
  try {
    const { items, totalAmount, shippingAddress, shippingCharges, paymentMethod = 'COD' } = req.body;
    
    // Ensure user is authenticated (middleware should handle this, but double-check)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
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
    
    // Calculate shipping charges if not provided
    let finalShippingCharges = shippingCharges;
    if (finalShippingCharges === undefined && shippingAddress?.country) {
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      finalShippingCharges = calculateShippingCharges(shippingAddress.country, subtotal);
    }
    
    // For COD orders, fulfillment status is 'Pending'; also mark payment status
    const orderStatus = paymentMethod === 'COD' ? 'Pending' : 'Paid';
    const paymentStatus = paymentMethod === 'COD' ? 'Unpaid' : 'Paid';
    
    // Create order - ensure user ID is properly set
    const order = await Order.create({ 
      user: req.user._id, 
      items, 
      totalAmount, 
      shippingCharges: finalShippingCharges || 0,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      status: orderStatus
    });
    
    // Deduct inventory after successful order creation
    for (const item of items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { inventory: -item.quantity } },
        { new: true }
      );
    }
    
    // Fire-and-forget admin email (do not block order creation response)
    try {
      sendOrderNotificationEmail(order).catch(() => {});
    } catch (_) {}

    res.status(201).json({ order });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Build query based on user role
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    
    // Find orders and populate book details
    const orders = await Order.find(query)
      .populate('items.book')
      .sort({ createdAt: -1 })
      .lean();
    
    // Ensure orders array is returned
    res.json({ orders: orders || [] });
  } catch (err) { 
    console.error('Error listing orders:', err);
    next(err); 
  }
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

