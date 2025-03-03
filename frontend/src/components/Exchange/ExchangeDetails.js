import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ExchangeDetails = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const { id } = useParams();
    const [exchange, setExchange] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    
    useEffect(() => {
        fetch(`http://localhost:3000/api/exchanges/${id}/details`)
        .then((response) => response.json())
        .then((data) => {
            setExchange(data.szczegoly_wymiany[0]);
        })
        .catch((err) => console.error('Błąd podczas pobierania szczegółów wymiany:', err));
    }, [id]);

    const handleAcceptExchange = (wymianaId) => {
        fetch(`http://localhost:3000/api/exchanges/${wymianaId}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setExchange((prevExchange) => ({
                ...prevExchange,
                status: 'zaakceptowana',
            }));
            navigate('/exchanges');
        })
        .catch((err) => console.error('Błąd podczas aktualizacji statusu wymiany:', err));
    };

    const handleRejectExchange = (wymianaId) => {
        fetch(`http://localhost:3000/api/exchanges/${wymianaId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setExchange((prevExchange) => ({
                ...prevExchange,
                status: 'odrzucona',
            }));
        })
        .catch((err) => console.error('Błąd podczas aktualizacji statusu wymiany:', err));
    
        fetch(`http://localhost:3000/api/books/status/${exchange.inicjator_ksiazka_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId: exchange.inicjator_ksiazka_id, status: 'dostępna' }),
        })
        .then((response) => {})
        .catch((err) => {
            console.error('Błąd podczas zmiany statusu książki:', err);
            alert('Wystąpił błąd.');
        });

        fetch(`http://localhost:3000/api/books/status/${exchange.odbiorca_ksiazka_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId: exchange.odbiorca_ksiazka_id, status: 'dostępna' }),
        })
        .then(() => {
            navigate('/exchanges');
        })
        .catch((err) => {
            console.error('Błąd podczas zmiany statusu książki:', err);
            alert('Wystąpił błąd.');
        });
    };

    const isUserCompleted = () => {
        if (parseInt(userId) === exchange.inicjator_id) {
            return exchange.inicjator_zakonczyl;
        }
        if (parseInt(userId) === exchange.odbiorca_id) {
            return exchange.odbiorca_zakonczyl;
        }
        return 0;
    };

    const handleCompleteExchange = () => {
        fetch(`http://localhost:3000/api/exchanges/${exchange.wymiana_id}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userId,
                inicjatorId: exchange.inicjator_id,
                inicjatorKsiazkaId: exchange.inicjator_ksiazka_id,
                odbiorcaId: exchange.odbiorca_id,
                odbiorcaKsiazkaId: exchange.odbiorca_ksiazka_id,
                komentarz: comment,
                ocena: rating,
            }),
        })
        .then(response => response.json())
        .then(data => {
            navigate('/exchanges');
        })
        .catch(err => console.error('Błąd przy zakończeniu wymiany:', err));
    };

    if (!exchange) {
        return <p>Ładowanie szczegółów wymiany...</p>;
    }

    return (
        <div>
             <header>
                <h1>BookSwap</h1>
            </header>
            <nav>
                <ul className="nav-links">
                    <li><Link to={`/home`}><p>Przeglądaj</p></Link></li>
                    {userRole === 'bibliotekarz' && (
                        <li><Link to="/booklist">Lista książek</Link></li>
                    )}
                    {userRole === 'administrator' && (
                        <>
                            <li><Link to={`/userlist`}>Lista użytkowników</Link></li>
                            <li><Link to={`/exchangelist`}>Lista wymian</Link></li>
                        </>
                    )}
                    <li><Link to={`/exchanges`}><p>Wymiany</p></Link></li>
                    <li><Link to={`/account`}><p>Moje konto</p></Link></li>
                    <li><Link to={`/`}><p>Wyloguj</p></Link></li>
                </ul>
            </nav>
            <main>
                <h2>Szczegóły wymiany</h2>
                <div className="exchangeDet-container">
                    <div className="exchangeDet-section left">
                        <h3>Odbiorca wymiany: <Link to={`/user/${exchange.odbiorca_id}`}>{exchange.odbiorca_imie}</Link></h3>
                        <div className="exchange-info">
                            <img
                                src={exchange.odbiorca_ksiazka_okladka}
                                alt={`Okładka książki ${exchange.odbiorca_ksiazka_tytul}`}
                                className="book-cover-exchange"
                            />
                            <div className="book-details-exchange">
                                <p><strong>Tytuł:</strong> {exchange.odbiorca_ksiazka_tytul}</p>
                                <p><strong>Autor:</strong> {exchange.odbiorca_ksiazka_autor}</p>
                            </div>
                        </div>
                    </div>

                    <div className="exchangeDet-section right">
                        <h3>Inicjator wymiany: <Link to={`/user/${exchange.inicjator_id}`}>{exchange.inicjator_imie}</Link></h3>
                        <div className="exchange-info">
                            <img
                                src={exchange.inicjator_ksiazka_okladka}
                                alt={`Okładka książki ${exchange.inicjator_ksiazka_tytul}`}
                                className="book-cover-exchange"
                            />
                            <div className="book-details-exchange">
                                <p><strong>Tytuł:</strong> {exchange.inicjator_ksiazka_tytul}</p>
                                <p><strong>Autor:</strong> {exchange.inicjator_ksiazka_autor}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {exchange.status === 'oczekuje' && parseInt(userId) === exchange.odbiorca_id && (
                    <div className="buttons-container">
                        <button onClick={() => handleAcceptExchange(exchange.wymiana_id)}>Akceptuj</button>
                        <button onClick={() => handleRejectExchange(exchange.wymiana_id)}>Odrzuć</button>
                    </div>
                )}

                {exchange.status === 'zaakceptowana' && isUserCompleted() === 0 && (
                    <div className="exchange-feedback">
                        <h2>Wymiana zakończona?</h2>
                        <h3>Podziel się swoją opinią o użytkowniku</h3>
                        <textarea
                            className="feedback-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Wpisz komentarz"
                            rows="4"
                            cols="50"
                        />

                        <div className="feedback-rating">
                            <label htmlFor="rating">Ocena:</label>
                            <input
                                type="range"
                                id="rating"
                                name="rating"
                                min="0"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            <span className="rating-value">{rating} / 5</span>
                        </div>
                        <button className="complete-exchange-btn" onClick={handleCompleteExchange}>Zakończ wymianę</button>
                    </div>
                )}

                {exchange.status === 'zakończona' && (
                    <div className="exchange-summary">
                        <h2>Podsumowanie wymiany</h2>
                        
                        <div className="feedback-container">
                            <div className="feedback-section">
                                <h3>Opinia inicjatora wymiany</h3>
                                <p><strong>Komentarz:</strong> {exchange.inicjator_komentarz || 'Brak komentarza'}</p>
                                <p><strong>Ocena:</strong> {exchange.inicjator_ocena ? `${exchange.inicjator_ocena} / 5` : 'Brak oceny'}</p>
                            </div>
                            <div className="feedback-section">
                                <h3>Opinia odbiorcy wymiany</h3>
                                <p><strong>Komentarz:</strong> {exchange.odbiorca_komentarz || 'Brak komentarza'}</p>
                                <p><strong>Ocena:</strong> {exchange.odbiorca_ocena ? `${exchange.odbiorca_ocena} / 5` : 'Brak oceny'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExchangeDetails;
