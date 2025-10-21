const express = require('express');
const { body } = require('express-validator');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/galleryController');

const router = express.Router();

// Public list (only published)
router.get('/public', async (req, res, next) => {
	try {
		const GalleryImage = require('../models/GalleryImage');
		const images = await GalleryImage.find({ status: 'Published' }).sort({ order: 1, createdAt: -1 });
		res.json({ images });
	} catch (err) { next(err); }
});

// Admin list and CRUD
router.get('/', requireAuth, requireAdmin, controller.list);
router.get('/:id', requireAuth, requireAdmin, controller.get);
router.post(
	'/',
	requireAuth,
	requireAdmin,
	[
		body('title').isString().trim().notEmpty(),
		body('src').isString().trim().notEmpty(),
		body('status').optional().isIn(['Draft', 'Published']),
		body('description').optional().isString(),
		body('alt').optional().isString(),
		body('order').optional().isNumeric(),
	],
	controller.create
);
router.put('/:id', requireAuth, requireAdmin, controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;

