const db = require('../config/db');

exports.getWishlistForUser = (userId, callback) => {
    const query = `
        SELECT Ksiazka.* 
        FROM Lista_zyczen 
        JOIN Ksiazka ON Lista_zyczen.ksiazka_id = Ksiazka.id 
        WHERE Lista_zyczen.uzytkownik_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.addBookToWishlist = (userId, bookId, callback) => {
    const query = 'INSERT INTO Lista_zyczen (ksiazka_id, uzytkownik_id, data_dodania) VALUES (?, ?, NOW())';

    db.query(query, [bookId, userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.removeBookFromWishlist = (userId, bookId, callback) => {
    const query = 'DELETE FROM Lista_zyczen WHERE uzytkownik_id = ? AND ksiazka_id = ?';
    
    db.query(query, [userId, bookId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};