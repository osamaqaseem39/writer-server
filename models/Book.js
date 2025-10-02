const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    coverImageUrl: { type: String },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
    inventory: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

