const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, default: '' },
		src: { type: String, required: true },
		status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
		alt: { type: String, default: '' },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

