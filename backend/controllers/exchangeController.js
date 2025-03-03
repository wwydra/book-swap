const Exchange = require('../models/exchangeModel');

exports.addExchange = (req, res) => {
    const { ksiazka_uo_id, uzytkownik_o_id, ksiazka_ui_id, uzytkownik_i_id } = req.body;

    const data_dodania = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');

    if (!ksiazka_uo_id || !uzytkownik_o_id || !ksiazka_ui_id || !uzytkownik_i_id) {
        return res.status(400).json({ error: 'Wszystkie pola muszą być wypełnione' });
    }

    const newExchange = {
        data_dodania,
        status: 'oczekuje',
        ksiazka_uo_id,
        uzytkownik_o_id,
        ksiazka_ui_id,
        uzytkownik_i_id
    };

    Exchange.addExchange(newExchange, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Wymiana została dodana', wymiana_id: result.wymiana_id });
    });
};

exports.acceptExchange = (req, res) => {
    const { id } = req.params;
    const status = 'zaakceptowana';  
    const updatedExchange = { status };
  
    Exchange.acreExchange(id, updatedExchange, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Wymiana została zaakceptowana' });
    });
};

exports.rejectExchange = (req, res) => {
    const { id } = req.params;
    const status = 'odrzucona';  
    const updatedExchange = { status };

    Exchange.acreExchange(id, updatedExchange, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Wymiana została odrzucona' });
    });
};

exports.completeExchange = (req, res) => {
    const { wymianaId } = req.params;
    const { userId, inicjatorId, inicjatorKsiazkaId, odbiorcaId, odbiorcaKsiazkaId, komentarz, ocena } = req.body;

    if (!userId || !inicjatorId || !inicjatorKsiazkaId || !odbiorcaId || !odbiorcaKsiazkaId) {
        return res.status(400).json({ message: 'Wszystkie pola muszą być wypełnione' });
    }

    Exchange.updateUserCompletion(wymianaId, userId, komentarz, ocena, (err, result) => {
        if (err) {
            console.error('Błąd podczas aktualizacji statusu użytkownika:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        Exchange.checkBothCompleted(wymianaId, (err, results) => {
            if (err) {
                console.error('Błąd podczas sprawdzania statusu wymiany:', err);
                return res.status(500).json({ message: 'Błąd serwera' });
            }

            const { zakonczone } = results[0];
            const data_dokonania_f = new Date().toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split('.').reverse().join('-');

            if (zakonczone === 2) {
                const updatedExchange = {
                    data_dokonania: data_dokonania_f,
                    wymianaId: wymianaId,
                    inicjator_id: inicjatorId,
                    inicjator_ksiazka_id: inicjatorKsiazkaId,
                    odbiorca_id: odbiorcaId,
                    odbiorca_ksiazka_id: odbiorcaKsiazkaId
                };

                Exchange.completeExchange(updatedExchange, (err, result) => {
                    if (err) {
                        console.error('Błąd podczas finalizacji wymiany:', err);
                        return res.status(500).json({ message: 'Błąd serwera' });
                    }

                    return res.status(200).json({ message: 'Wymiana zakończona pomyślnie' });
                });
            } else {
                return res.status(200).json({ message: 'Status użytkownika zaktualizowany. Oczekiwanie na zakończenie wymiany przez drugiego użytkownika.' });
            }
        });
    });
};

exports.addFeedback = (req, res) => {
    const { wymiana_id, uzytkownik_id, ocena, komentarz } = req.body;

    if (ocena < 0 || ocena > 5) {
        return res.status(400).json({ error: 'Ocena musi być w przedziale od 0 do 5' });
    }

    Exchange.addFeedback(wymiana_id, uzytkownik_id, ocena, komentarz, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Ocena i komentarz zostały zaktualizowane pomyślnie' });
    });
};

exports.getExchangesByUser = (req, res) => {
    const { id } = req.params;

    Exchange.getExchangesByUser(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Brak wymian dla tego użytkownika' });
        }
        res.json(results);
    });
};

exports.getExchangeDetails = (req, res) => {
    const { id } = req.params;

    Exchange.getExchangeDetails(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nie znaleziono wymiany o tym ID' });
        }
        res.json({ szczegoly_wymiany: results });
    });
};

exports.getAllExchanges = (req, res) => {
    Exchange.getAllExchanges((err, exchanges) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd przy pobieraniu wymian', error: err });
        }
        if (!exchanges || exchanges.length === 0) {
            return res.status(404).json({ message: 'Nie znaleziono wymian' });
        }
        res.status(200).json(exchanges);
    });
};