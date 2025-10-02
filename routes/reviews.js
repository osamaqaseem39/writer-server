const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', reviewController.list);
router.post('/', [
  body('name').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('text').notEmpty(),
  body('location').optional().isString(),
  body('imageUrl').optional().isString(),
], reviewController.create);

router.put('/:id', requireAuth, requireAdmin, reviewController.update);
router.delete('/:id', requireAuth, requireAdmin, reviewController.remove);

module.exports = router;

