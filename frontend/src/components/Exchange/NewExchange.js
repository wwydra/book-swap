import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const NewExchange = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [user, setUser] = useState(null);
    const [userBooks, setUserBooks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/books/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                setBook(data);
                fetch(`http://localhost:3000/api/users/${data.uzytkownik_id}`)
                .then((response) => response.json())
                .then((userData) => setUser(userData))
                .catch((err) => console.error('Błąd podczas pobierania danych użytkownika:', err));
            }
        })
        .catch((err) => console.error('Błąd podczas pobierania książki:', err));

        fetch(`http://localhost:3000/api/books/user/${userId}`)
        .then((response) => response.json())
        .then((data) => setUserBooks(data))
        .catch((err) => console.error('Błąd podczas pobierania książek użytkownika:', err));
    }, [bookId]);

    const handleSelectBook = (selectedBookId, uId) => {
        fetch(`http://localhost:3000/api/exchanges`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ksiazka_uo_id: bookId,
                uzytkownik_o_id: uId,
                ksiazka_ui_id: selectedBookId,
                uzytkownik_i_id: userId,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                fetch(`http://localhost:3000/api/books/status/${selectedBookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookId: selectedBookId, status: 'zarezerwowana' }),
                })
                .then(response => response.json())
                .then(updatedData => {
                    console.log(updatedData);
                })
                .catch(err => console.error('Błąd podczas aktualizowania statusu książki użytkownika I:', err));
    
                fetch(`http://localhost:3000/api/books/status/${bookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookId, status: 'zarezerwowana' }),
                })
                .then(response => response.json())
                .then(updatedData => {
                    navigate('/exchanges');
                })
                .catch(err => console.error('Błąd podczas aktualizowania statusu książki użytkownika O:', err));
            }
        })
        .catch((err) => console.error('Błąd podczas inicjowania wymiany:', err));
    };

    if (!book || !user) {
        return <p>Ładowanie danych...</p>;
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
                <h2 className="log">Wymiana z użytkownikiem: {user.imie}</h2>
    
                <h3>Książka do wymiany:</h3>
                <div className="exchange-info">
                    <img
                        src={book.zdjecie_okladki}
                        alt={`Okładka książki ${book.tytul}`}
                        className="book-cover-exchange"
                    />
                    <div className="book-details-exchange">
                        <p><strong>Tytuł:</strong> {book.tytul}</p>
                        <p><strong>Autor:</strong> {book.autor}</p>
                    </div>
                </div>

                <div className="book-list-newex">
                    <h3>Wybierz książkę, którą chcesz wymienić:</h3>
                    <ul className="book-list">
                        {userBooks.length > 0 ? (
                            userBooks
                                .filter((userBook) => userBook.status === 'dostępna')
                                .map((userBook) => (
                                    <li key={userBook.id} className="book-item">
                                        <div className="book-info">
                                            <img
                                                src={userBook.zdjecie_okladki}
                                                alt={`Okładka książki ${userBook.tytul}`}
                                                className="book-cover-main"
                                            />
                                            <div className="book-details">
                                                <h3>{userBook.tytul}</h3>
                                                <p>{userBook.autor}</p>
                                            </div>
                                        </div>
                                        <div className="book-actions">
                                            <button onClick={() => handleSelectBook(userBook.id, book.uzytkownik_id)}>
                                                Wybierz
                                            </button>
                                        </div>
                                    </li>
                                ))
                        ) : (
                            <p>Nie masz książek do zaoferowania.</p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default NewExchange;