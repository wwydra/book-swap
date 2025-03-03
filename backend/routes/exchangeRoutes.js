const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

router.post('/', exchangeController.addExchange);
router.put('/:id/accept', exchangeController.acceptExchange);
router.put('/:id/reject', exchangeController.rejectExchange);
router.put('/:wymianaId/complete', exchangeController.completeExchange);
router.post('/feedback', exchangeController.addFeedback);
router.get('/user/:id', exchangeController.getExchangesByUser);
router.get('/:id/details', exchangeController.getExchangeDetails);
router.get('/', exchangeController.getAllExchanges);


module.exports = router;