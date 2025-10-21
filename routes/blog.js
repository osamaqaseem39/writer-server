const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', blogController.list);
router.get('/:id', blogController.get);

router.post('/', requireAuth, requireAdmin, [
  body('title').notEmpty(),
  body('content').notEmpty(),
], blogController.create);

router.put('/:id', requireAuth, requireAdmin, blogController.update);
router.delete('/:id', requireAuth, requireAdmin, blogController.remove);

module.exports = router;

