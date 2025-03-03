const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/', bookController.addBook);
router.delete('/:id', bookController.deleteBook);
router.put('/:id', bookController.updateBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookDetails);
router.get('/user/:userId', bookController.getBooksByUser);
router.put('/status/:id', bookController.updateBookStatus);

module.exports = router;