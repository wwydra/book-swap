const Book = require('../models/bookModel');

exports.addBook = (req, res) => {
    const { tytul, autor, ISBN, data_wydania, wydawnictwo, gatunek, jezyk, liczba_stron, zdjecie_okladki, uzytkownik_id } = req.body;
  
    if (!tytul || !autor || !ISBN || !data_wydania || !wydawnictwo || !gatunek || !jezyk || !liczba_stron || !uzytkownik_id) {
        return res.status(400).json({ error: 'Wszystkie pola muszą być wypełnione' });
    }
    if (isNaN(liczba_stron) || liczba_stron <= 0) {
        return res.status(400).json({ error: 'Liczba stron musi być większa od zera' });
    }

    const data_dodania = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');

    const publicationDate = new Date(data_wydania).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');
    
    if (publicationDate > data_dodania) {
        return res.status(400).json({ error: 'Data wydania nie może być w przyszłości' });
    }

    const newBook = {
        tytul,
        autor,
        ISBN,
        data_wydania: publicationDate,
        wydawnictwo,
        gatunek,
        jezyk,
        liczba_stron,
        zdjecie_okladki,
        status: 'dostępna',
        data_dodania,
        uzytkownik_id
    };
  
    Book.addBook(newBook, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Książka została dodana' });
    });
};

exports.deleteBook = (req, res) => {
    const { id } = req.params;
  
    Book.deleteBook(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Książka została usunięta' });
    });
};

exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { tytul, autor, ISBN, data_wydania, wydawnictwo, gatunek, jezyk, liczba_stron, zdjecie_okladki } = req.body;
    const publicationDate = new Date(data_wydania).toISOString().slice(0, 10);

    if (!tytul || !autor || !ISBN || !data_wydania || !wydawnictwo || !gatunek || !jezyk || !liczba_stron) {
        return res.status(400).json({ error: 'Wszystkie pola muszą być wypełnione' });
    }
    if (liczba_stron <= 0 || isNaN(liczba_stron)) {
        return res.status(400).json({ error: 'Liczba stron musi być większa od zera' });
    }
    if (publicationDate > new Date().toISOString().slice(0, 10)) {
        return res.status(400).json({ error: 'Data wydania nie może być w przyszłości' });
    }
    
    const updatedBook = {
        tytul,
        autor,
        ISBN,
        data_wydania: publicationDate,
        wydawnictwo,
        gatunek,
        jezyk,
        liczba_stron,
        zdjecie_okladki
    };
  
    Book.updateBook(id, updatedBook, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Książka została zaktualizowana' });
    });
};

exports.getAllBooks = (req, res) => {
    Book.getAllBooks((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getBookDetails = (req, res) => {
    const { id } = req.params;
  
    Book.getBookDetails(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Książka nie została znaleziona' });
        }
        res.json(results[0]);
    });
};

exports.getBooksByUser = (req, res) => {
    const { userId } = req.params;

    Book.getBooksByUser(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Brak książek dla tego użytkownika.' });
        }
        res.json(results);
    });
};

exports.updateBookStatus = (req, res) => {
    const { bookId, status } = req.body;
    const validStatuses = ['dostępna', 'zarezerwowana', 'niedostępna'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Niepoprawny status. Dozwolone statusy to: "dostępna", "zarezerwowana", "niedostępna".' });
    }

    Book.updateBookStatus(bookId, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji statusu książki.' });
        }
        if (!result.updated) {
            return res.status(404).json({ message: result.message });
        }
        res.json({ message: result.message });
    });
};