const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/', requireAuth, orderController.create);
router.get('/', requireAuth, orderController.list);
router.get('/:id', requireAuth, orderController.get);
router.put('/:id/cancel', requireAuth, orderController.cancel);

module.exports = router;

