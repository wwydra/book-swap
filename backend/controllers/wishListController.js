const WishList = require('../models/wishListModel');

exports.getWishlistForUser = (req, res) => {
    const { userId } = req.params;
  
    WishList.getWishlistForUser(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.addBookToWishlist = (req, res) => {
    const userId = req.params.userId;
    const { bookId } = req.body;
  
    WishList.addBookToWishlist(userId, bookId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Książka została dodana do listy życzeń' });
    });
};

exports.removeBookFromWishlist = (req, res) => {
    const userId = req.params.userId;
    const { bookId } = req.body;
  
    WishList.removeBookFromWishlist(userId, bookId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Książka została usunięta z listy życzeń' });
    });
};