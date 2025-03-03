const db = require('../config/db');

exports.addBook = (newBook, callback) => {
    const query = `
        INSERT INTO Ksiazka (tytul, autor, ISBN, data_wydania, wydawnictwo, gatunek, jezyk, liczba_stron, zdjecie_okladki, status, data_dodania, uzytkownik_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        newBook.tytul,
        newBook.autor,
        newBook.ISBN,
        newBook.data_wydania,
        newBook.wydawnictwo,
        newBook.gatunek,
        newBook.jezyk,
        newBook.liczba_stron,
        newBook.zdjecie_okladki,
        newBook.status,
        newBook.data_dodania,
        newBook.uzytkownik_id
    ], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.deleteBook = (id, callback) => {
    const query = 'DELETE FROM Ksiazka WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.updateBook = (id, updatedBook, callback) => {
    const query = `
        UPDATE Ksiazka SET tytul = ?, autor = ?, ISBN = ?, data_wydania = ?, wydawnictwo = ?, gatunek = ?, jezyk = ?, liczba_stron = ?, zdjecie_okladki = ?
        WHERE id = ?
    `;

    db.query(query, [
        updatedBook.tytul,
        updatedBook.autor,
        updatedBook.ISBN,
        updatedBook.data_wydania,
        updatedBook.wydawnictwo,
        updatedBook.gatunek,
        updatedBook.jezyk,
        updatedBook.liczba_stron,
        updatedBook.zdjecie_okladki,
        id
    ], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

exports.getAllBooks = (callback) => {
    const query = 'SELECT * FROM Ksiazka';

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.getBookDetails = (id, callback) => {
    const query = `
        SELECT k.*, u.imie AS wlasciciel 
        FROM Ksiazka k
        JOIN Uzytkownik u ON k.uzytkownik_id = u.id
        WHERE k.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, []);
        }
        callback(null, results);
    });
};

exports.getBooksByUser = (userId, callback) => {
    const query = `SELECT * FROM Ksiazka WHERE uzytkownik_id = ?;`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.updateBookStatus = (bookId, status, callback) => {
    const query = `UPDATE Ksiazka SET status = ? WHERE id = ?`;
    
    db.query(query, [status, bookId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, { message: 'Status książki został zaktualizowany.', updated: true });
    });
};