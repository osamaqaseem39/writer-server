const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', bookController.list);
router.get('/:id', bookController.get);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('price').isFloat({ gt: 0 }),
  ],
  bookController.create
);

router.put('/:id', requireAuth, requireAdmin, bookController.update);
router.delete('/:id', requireAuth, requireAdmin, bookController.remove);

module.exports = router;

