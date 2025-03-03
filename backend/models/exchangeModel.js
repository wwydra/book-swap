const db = require('../config/db');

exports.addExchange = (newExchange, callback) => {
    const query1 = 'INSERT INTO Wymiana (data_dodania, status) VALUES (?, ?);';
    const query2 = 'INSERT INTO Ksiazka_Wymiana (wymiana_id, ksiazka_id, uzytkownik_id) VALUES (?, ?, ?)';

    db.query(query1, [newExchange.data_dodania, newExchange.status], (err, result) => {
        if (err) {
            return callback(err);
        }

        const wymiana_id = result.insertId;

        db.query(query2, [wymiana_id, newExchange.ksiazka_ui_id, newExchange.uzytkownik_i_id], (err, result) => {
            if (err) {
                return callback(err);
            }

            db.query(query2, [wymiana_id, newExchange.ksiazka_uo_id, newExchange.uzytkownik_o_id], (err, result) => {
                if (err) {
                    return callback(err);
                }
                callback(null, { message: 'Wymiana i powiązanie książek zostały dodane', wymiana_id });
            });
        });
    });
};

exports.completeExchange = (updatedExchange, callback) => {
    const query1 = `
        UPDATE Wymiana
        SET status = 'zakończona', data_dokonania = ?
        WHERE id = ?
    `;    
    const query2 = `
        UPDATE Ksiazka
        SET uzytkownik_id = ?, status = 'dostępna'
        WHERE id = ?
    `;

    db.query(query1, [updatedExchange.data_dokonania, updatedExchange.wymianaId], (err, result1) => {
        if (err) {
            return callback(err);
        }

        db.query(query2, [updatedExchange.inicjator_id, updatedExchange.odbiorca_ksiazka_id], (err, result2) => {
            if (err) {
                return callback(err);
            }

            db.query(query2, [updatedExchange.odbiorca_id, updatedExchange.inicjator_ksiazka_id], (err, result3) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, { message: 'Wymiana zakończona pomyślnie. Książki zostały wymienione!' });
            });
        });
    });
};

exports.checkBothCompleted = (wymianaId, callback) => {
    const query = `
        SELECT COUNT(*) AS zakonczone
        FROM Ksiazka_Wymiana
        WHERE wymiana_id = ? AND zakonczyl = true
    `;

    db.query(query, [wymianaId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.updateUserCompletion = (wymianaId, userId, komentarz, ocena, callback) => {
    const query1 = `
        UPDATE Ksiazka_Wymiana
        SET zakonczyl = true
        WHERE wymiana_id = ? AND uzytkownik_id = ?
    `;
    const query2 = `
        UPDATE Ksiazka_Wymiana 
        SET komentarz = ?, ocena = ? 
        WHERE wymiana_id = ? AND uzytkownik_id != ?
    `;

    db.query(query1, [wymianaId, userId], (err, result1) => {
        if (err) {
            return callback(err);
        }

        db.query(query2, [komentarz, ocena, wymianaId, userId], (err, result2) => {
            if (err) {
                return callback(err);
            }
            return callback(null, { message: 'Wymiana zakończona i oceniona!' });
        });
    });
};

exports.acreExchange = (id, updatedExchange, callback) => {
    const query = `
        UPDATE Wymiana
        SET status = ?
        WHERE id = ?
    `;

    db.query(query, [updatedExchange.status, id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

exports.addFeedback = (wymiana_id, uzytkownik_id, ocena, komentarz, callback) => {
    const query = `
        UPDATE Ksiazka_Wymiana
        SET ocena = ?, komentarz = ?
        WHERE wymiana_id = ? AND uzytkownik_id != ?
    `;
    
    db.query(query, [ocena, komentarz, wymiana_id, uzytkownik_id], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

exports.getExchangesByUser = (id, callback) => {
    const query = `
        SELECT 
            Wymiana.id AS wymiana_id, 
            Wymiana.status, 
            Ksiazka_Wymiana.ksiazka_id, 
            Ksiazka.tytul, 
            Ksiazka.autor, 
            Ksiazka.zdjecie_okladki
        FROM Wymiana
        JOIN Ksiazka_Wymiana ON Wymiana.id = Ksiazka_Wymiana.wymiana_id
        JOIN Ksiazka ON Ksiazka_Wymiana.ksiazka_id = Ksiazka.id
        WHERE Wymiana.id IN (
            SELECT wymiana_id 
            FROM Ksiazka_Wymiana 
            WHERE uzytkownik_id = ?
        )AND Ksiazka_Wymiana.uzytkownik_id != ?
    `;
    
    db.query(query, [id, id], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

exports.getExchangeDetails = (id, callback) => {
    const query = `
        SELECT 
            Wymiana.id AS wymiana_id,
            Wymiana.data_dodania,
            Wymiana.data_dokonania,
            Wymiana.status,
            KW1.ksiazka_id AS inicjator_ksiazka_id,
            KW1.zakonczyl AS inicjator_zakonczyl,
            KW1.komentarz AS odbiorca_komentarz,
            KW1.ocena AS odbiorca_ocena,
            U1.id AS inicjator_id,
            U1.imie AS inicjator_imie,
            Ksiazka1.tytul AS inicjator_ksiazka_tytul,
            Ksiazka1.autor AS inicjator_ksiazka_autor,
            Ksiazka1.zdjecie_okladki AS inicjator_ksiazka_okladka,
    
            KW2.ksiazka_id AS odbiorca_ksiazka_id,
            KW2.zakonczyl AS odbiorca_zakonczyl,
            KW2.komentarz AS inicjator_komentarz,
            KW2.ocena AS inicjator_ocena,
            U2.id AS odbiorca_id,
            U2.imie AS odbiorca_imie,
            Ksiazka2.tytul AS odbiorca_ksiazka_tytul,
            Ksiazka2.autor AS odbiorca_ksiazka_autor,
            Ksiazka2.zdjecie_okladki AS odbiorca_ksiazka_okladka
        FROM Wymiana
        JOIN Ksiazka_Wymiana KW1 ON Wymiana.id = KW1.wymiana_id
        JOIN Ksiazka_Wymiana KW2 ON Wymiana.id = KW2.wymiana_id AND KW1.id <> KW2.id
        JOIN Ksiazka Ksiazka1 ON KW1.ksiazka_id = Ksiazka1.id
        JOIN Ksiazka Ksiazka2 ON KW2.ksiazka_id = Ksiazka2.id
        JOIN Uzytkownik U1 ON KW1.uzytkownik_id = U1.id
        JOIN Uzytkownik U2 ON KW2.uzytkownik_id = U2.id
        WHERE Wymiana.id = ?
        LIMIT 1
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

exports.getAllExchanges = (callback) => {
    const query = `
        SELECT 
            Wymiana.id AS wymiana_id,
            Wymiana.status,
            U1.id AS inicjator_id,
            U1.imie AS inicjator_imie,
            U2.id AS odbiorca_id,
            U2.imie AS odbiorca_imie,
            Ksiazka1.id AS inicjator_ksiazka_id,
            Ksiazka1.tytul AS inicjator_ksiazka_tytul,
            Ksiazka1.autor AS inicjator_ksiazka_autor,
            Ksiazka1.zdjecie_okladki AS inicjator_ksiazka_okladka,
            Ksiazka2.id AS odbiorca_ksiazka_id,
            Ksiazka2.tytul AS odbiorca_ksiazka_tytul,
            Ksiazka2.autor AS odbiorca_ksiazka_autor,
            Ksiazka2.zdjecie_okladki AS odbiorca_ksiazka_okladka
        FROM Wymiana
        JOIN Ksiazka_Wymiana KW1 ON Wymiana.id = KW1.wymiana_id
        JOIN Ksiazka_Wymiana KW2 ON Wymiana.id = KW2.wymiana_id AND KW1.id <> KW2.id
        JOIN Ksiazka Ksiazka1 ON KW1.ksiazka_id = Ksiazka1.id
        JOIN Ksiazka Ksiazka2 ON KW2.ksiazka_id = Ksiazka2.id
        JOIN Uzytkownik U1 ON KW1.uzytkownik_id = U1.id
        JOIN Uzytkownik U2 ON KW2.uzytkownik_id = U2.id;
    `;  

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
};