const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishListController.js');

router.get('/:userId', wishlistController.getWishlistForUser);
router.post('/:userId', wishlistController.addBookToWishlist);
router.delete('/:userId', wishlistController.removeBookFromWishlist);

module.exports = router;