const User = require('../models/userModel');
const { isEmail } = require('validator');

exports.registerUser = (req, res) => {
    const { email, haslo, imie, data_urodzenia } = req.body;

    if (!isEmail(email)) {
        return res.status(400).json({ message: 'Podaj prawidłowy adres e-mail' });
    }
    if (!haslo || haslo.length < 6) {
        return res.status(400).json({ message: 'Hasło musi mieć co najmniej 6 znaków' });
    }
    if (!imie || imie.trim().length === 0) {
        return res.status(400).json({ message: 'Imię jest wymagane' });
    }

    const currentDate = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');
    const birthDate = new Date(data_urodzenia).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');

    if (birthDate > currentDate) {
        return res.status(400).json({ message: 'Data urodzenia nie może być w przyszłości' });
    }
  
    User.getUserByEmail(email, (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: 'Użytkownik o tym adresie e-mail już istnieje' });
        }

        const newUser = { 
            email, 
            haslo, 
            imie, 
            data_urodzenia: birthDate,
            rola: 'zalogowany'
        };
  
        User.registerUser(newUser, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Użytkownik został zarejestrowany' });
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, haslo } = req.body;

    User.getUserByEmail(email, (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        if (haslo !== results[0].haslo) {
            return res.status(401).json({ message: 'Niepoprawne hasło' });
        }
        res.json({
            message: 'Zalogowano pomyślnie',
            userId: results[0].id,
            userRole: results[0].rola,
        });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { imie, data_urodzenia } = req.body;

    if (!imie || imie.trim().length === 0) {
        return res.status(400).json({ message: 'Imię jest wymagane' });
    }
    
    const birthDate = new Date(data_urodzenia).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');
    const currentDate = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');
    
    if (birthDate > currentDate) {
        return res.status(400).json({ error: 'Data urodzenia nie może być w przyszłości' });
    }
  
    const updatedData = { imie, data_urodzenia: birthDate };
  
    User.updateUser(id, updatedData, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Dane użytkownika zostały zaktualizowane' });
    });
};

exports.changePassword = (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Hasło musi zawierać co najmniej 6 znaków' });
    }
  
    User.changePassword(id, newPassword, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Hasło zostało zmienione' });
    });
};

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getUserDetails = (req, res) => {
    const { id } = req.params;
  
    User.getUserById(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        res.json(results[0]);
    });
};

exports.getReviewsForUser = (req, res) => {
    const { id } = req.params;

    User.getAverageRating(id, (err, sredniaOcena) => {
        if (err) {
            console.error('Błąd podczas pobierania średniej oceny:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        User.getComments(id, (err, komentarze) => {
            if (err) {
                console.error('Błąd podczas pobierania komentarzy:', err);
                return res.status(500).json({ message: 'Błąd serwera' });
            }
            res.status(200).json({
                sredniaOcena,
                komentarze,
            });
        });
    });
};

exports.updateUserRole = (req, res) => {
    const { id } = req.params;
    const { rola } = req.body;

    const allowedRoles = ['zalogowany', 'bibliotekarz', 'administrator'];
    if (!allowedRoles.includes(rola)) {
        return res.status(400).json({ message: 'Nieprawidłowa rola. Dozwolone role to: zalogowany, bibliotekarz, administrator' });
    }

    User.updateUserRole(id, rola, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd podczas aktualizacji roli', error: err.message });
        }
        if (!results) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        res.status(200).json({ message: 'Rola zmieniona' });
    });
};