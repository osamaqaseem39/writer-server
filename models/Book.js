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
    featured: { type: Boolean, default: false },
    genre: { type: String },
    year: { type: String },
    pages: { type: Number },
    rating: { type: Number },
    reviews: { type: Number },
    isbn: { type: String },
    language: { type: String },
    readingTime: { type: String },
    publisher: { type: String },
    publishDate: { type: String },
    fullDescription: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

