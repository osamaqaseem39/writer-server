const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);

