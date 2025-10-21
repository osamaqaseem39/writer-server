const { validationResult } = require('express-validator');
const GalleryImage = require('../models/GalleryImage');

exports.list = async (req, res, next) => {
	try {
		const images = await GalleryImage.find({}).sort({ order: 1, createdAt: -1 });
		res.json({ images });
	} catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
	try {
		const image = await GalleryImage.findById(req.params.id);
		if (!image) return res.status(404).json({ message: 'Image not found' });
		res.json({ image });
	} catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const image = await GalleryImage.create(req.body);
		res.status(201).json({ image });
	} catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
	try {
		const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!image) return res.status(404).json({ message: 'Image not found' });
		res.json({ image });
	} catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
	try {
		const image = await GalleryImage.findByIdAndDelete(req.params.id);
		if (!image) return res.status(404).json({ message: 'Image not found' });
		res.json({ message: 'Deleted' });
	} catch (err) { next(err); }
};

