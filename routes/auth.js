const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

router.post('/logout', authController.logout);

router.post(
  '/auto-register',
  [
    body('email').isEmail(),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('phone').notEmpty(),
  ],
  authController.autoRegister
);

router.get('/me', authController.me);

// Debug endpoint to check user role
router.get('/check-role', authController.checkRole);

// Admin role management routes (protected by admin middleware)
router.get('/users', authController.listUsers);
router.put('/promote/:userId', authController.promoteToAdmin);
router.put('/demote/:userId', authController.demoteToCustomer);

module.exports = router;

