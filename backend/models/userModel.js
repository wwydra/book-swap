const db = require('../config/db');

exports.registerUser = (newUser, callback) => {
    const query = `
        INSERT INTO Uzytkownik (email, haslo, imie, data_urodzenia, rola)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [newUser.email, newUser.haslo, newUser.imie, newUser.data_urodzenia, newUser.rola], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.getUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM Uzytkownik WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.getAllUsers = (callback) => {
    const query = 'SELECT id, email, imie, data_urodzenia, rola FROM Uzytkownik';

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.getUserById = (id, callback) => {
    const query = 'SELECT * FROM Uzytkownik WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.updateUser = (id, updatedData, callback) => {
    const query = 'UPDATE Uzytkownik SET imie = ?, data_urodzenia = ? WHERE id = ?';

    db.query(query, [updatedData.imie, updatedData.data_urodzenia, id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.changePassword = (id, newPassword, callback) => {
    const query = 'UPDATE Uzytkownik SET haslo = ? WHERE id = ?';

    db.query(query, [newPassword, id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.getAverageRating = (userId, callback) => {
    const query = `
        SELECT AVG(kw.ocena) AS sredniaOcena
        FROM Ksiazka_Wymiana kw
        WHERE kw.uzytkownik_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err);
        }

        const sredniaOcena = results.length > 0 && results[0].sredniaOcena !== null
            ? parseFloat(results[0].sredniaOcena).toFixed(1)
            : null;

        callback(null, sredniaOcena);
    });
};

exports.getComments = (userId, callback) => {
    const query = `
        SELECT kw.komentarz
        FROM Ksiazka_Wymiana kw
        WHERE kw.uzytkownik_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err);
        }

        const komentarze = results.map(({ komentarz }) => ({ komentarz }));

        callback(null, komentarze);
    });
};

exports.updateUserRole = (id, rola, callback) => {
    const query = 'UPDATE Uzytkownik SET rola = ? WHERE id = ?';

    db.query(query, [rola, id], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};