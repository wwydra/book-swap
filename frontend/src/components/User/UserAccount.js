import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserAccount = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [reviews, setReviews] = useState({
        sredniaOcena: null,
        komentarze: [],
    });

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((err) => console.error('Błąd podczas pobierania danych użytkownika:', err));

            fetch(`http://localhost:3000/api/books/user/${userId}`)
            .then((response) => response.json())
            .then((data) => setBooks(data))
            .catch((err) => console.error('Błąd podczas pobierania książek użytkownika:', err));

            fetch(`http://localhost:3000/api/wishlist/${userId}`)
            .then((response) => response.json())
            .then((data) => setWishlist(data))
            .catch((err) => console.error('Błąd podczas pobierania listy życzeń:', err));

            fetch(`http://localhost:3000/api/users/${userId}/reviews`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((err) => console.error('Błąd podczas pobierania recenzji użytkownika:', err));
        }
    }, []);

    const changeBookStatus = (bookId, currentStatus) => {
        const newStatus = currentStatus === 'dostępna' ? 'niedostępna' : 'dostępna';
        
        fetch(`http://localhost:3000/api/books/status/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId, status: newStatus }),
        })
        .then((response) => {
            if (response.ok) {
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === bookId ? { ...book, status: newStatus } : book
                    )
                );
            } else {
                alert('Wystąpił błąd podczas zmiany statusu książki.');
            }
        })
        .catch((err) => {
            console.error('Błąd podczas zmiany statusu książki:', err);
            alert('Wystąpił błąd.');
        });
    };

    const removeBook = (bookId) => {    
        fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.ok) {
                setBooks(books.filter(book => book.id !== bookId));
            } else {
                alert('Wystąpił błąd podczas usuwania książki.');
            }
        })
        .catch((err) => {
            console.error('Błąd podczas usuwania książki:', err);
            alert('Wystąpił błąd.');
        });
    };

    const removeFromWishList = (bookId) => {
        fetch(`http://localhost:3000/api/wishlist/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        })
        .then((response) => {
            if (response.ok) {
                setWishlist(wishlist.filter(wish => wish.id !== bookId));
            } else {
                alert('Wystąpił błąd podczas usuwania książki z listy życzeń.');
            }
        })
        .catch((err) => {
            console.error('Błąd podczas usuwania książki z listy życzeń:', err);
            alert('Wystąpił błąd.');
        });
    };

    if (!user) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    const birthDate = new Date(user.data_urodzenia).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');

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
                <h2>Moje konto</h2>
                <div className="account-container">
                    <div className="left-section">
                        <div className="user-data">
                            <h3>Dane użytkownika:</h3>
                            <p><strong>Imię:</strong> {user.imie}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Data urodzenia:</strong> {birthDate}</p>
                            <p>{user.rola}</p>
                        </div>
                        <button className="settings-button" onClick={() => navigate('/account-settings')}>Przejdź do ustawień konta</button>

                        <div className="average-rating">
                            <h3>Średnia ocena: {reviews.sredniaOcena ? `${reviews.sredniaOcena}/5` : 'Brak ocen'}
                                <span className="star-icon" style={{ color: 'gold', marginLeft: '5px' }}>★</span>
                            </h3>
                        </div>

                        <div className="comments-section">
                            <h3>Komentarze:</h3>
                            <ul>
                                {reviews.komentarze.length > 0 ? (
                                    reviews.komentarze.filter((review) => review.komentarz !== null)
                                        .map((review, index) => (
                                            <li key={index}>
                                                <p>{review.komentarz}</p>
                                            </li>
                                        ))
                                ) : (<p>Brak komentarzy.</p>)}
                            </ul>
                        </div>

                        <div className="wishlist-section">
                            <h3>Lista życzeń:</h3>
                            <ul className="book-list">
                                {wishlist.length > 0 ? (
                                    wishlist.map((wish) => (
                                        <li key={wish.id} className="book-item">
                                            <div className="book-info">
                                                <Link to={`/books/${wish.id}`}>
                                                    <img 
                                                        src={wish.zdjecie_okladki} 
                                                        alt={`Okładka książki ${wish.tytul}`} 
                                                        className="book-cover-main" 
                                                    />
                                                </Link>
                                                <div className="book-details">
                                                    <Link to={`/books/${wish.id}`}><h3>{wish.tytul}</h3></Link>
                                                    <p>{wish.autor}</p>
                                                </div>
                                            </div>
                                            <div className="book-actions">
                                            {wish.status === 'dostępna' && (
                                                <button onClick={() => navigate(`/exchange/${wish.id}`)}>Wymień się</button>
                                            )}
                                            <button onClick={() => removeFromWishList(wish.id)}>Usuń z listy</button>
                                            </div>
                                        </li>
                                    ))
                                ) : (<p>Brak książek na liście życzeń.</p>)}
                            </ul>
                        </div>
                    </div>

                    <div className="right-section">
                        <div className="my-books-section">
                            <div className="my-books-header">
                                <h3>Moje książki:</h3>
                                <button onClick={() => navigate('/add-book')} className="add-book-button">Dodaj książkę</button>
                            </div>
                            <ul className="book-list">
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <li key={book.id} className="book-item">
                                            <div className="book-info">
                                                <Link to={`/books/${book.id}`}>
                                                    <img 
                                                        src={book.zdjecie_okladki} 
                                                        alt={`Okładka książki ${book.tytul}`} 
                                                        className="book-cover-main" 
                                                    />
                                                </Link>
                                                <div className="book-details">
                                                    <Link to={`/books/${book.id}`}><h3>{book.tytul}</h3></Link>
                                                    <p>{book.autor}</p>
                                                </div>
                                            </div>
                                            <div className="book-actions">
                                                {book.status !== 'zarezerwowana' && (
                                                    <button onClick={() => changeBookStatus(book.id, book.status)}>
                                                        {book.status === 'dostępna' ? 'Oznacz jako niedostępną' : 'Oznacz jako dostępną'}
                                                    </button>
                                                )}
                                                <button onClick={() => removeBook(book.id)}>Usuń</button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p>Brak dodanych książek.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserAccount;