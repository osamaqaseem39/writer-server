const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');

// Token and refresh
router.post('/token', controller.getToken);
router.post('/refreshtoken', controller.refreshToken);

// Lists
router.get('/list/banks', controller.listBanks);
router.get('/list/instruments', controller.listInstruments);
router.get('/list/instrumentbanks', controller.listInstrumentBanks);

// Customer validation
router.post('/customer/validate', controller.customerValidate);

// Transactions
router.post('/transaction', controller.initiateTransaction);
router.post('/transaction/token', controller.tempTransactionToken);
router.post('/transaction/tokenized', controller.tokenizedTransaction);
router.post('/transaction/recurring/otp', controller.recurringOtp);
router.post('/transaction/recurring', controller.recurringTransaction);
router.post('/transaction/refund/:transaction_id', controller.refundTransaction);

// Status
router.get('/transaction/:transaction_id', controller.getTransactionStatusById);
router.get('/transaction/basket_id/:basket_id', controller.getTransactionStatusByBasketId);

// Instruments
router.get('/user/instruments', controller.fetchUserInstruments);
router.post('/user/instruments', controller.addPermanentInstrument);
router.delete('/user/instruments', controller.deleteInstrument);

module.exports = router;

