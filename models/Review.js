const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    bookId: { type: String, required: true },
    approved: { type: Boolean, default: false },
    orderId: { type: String },
    orderStatus: { type: String },
    isVerified: { type: Boolean, default: false },
    location: { type: String },
    profession: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);

