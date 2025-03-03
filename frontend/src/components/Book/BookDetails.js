import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const BookDetails = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/books/${id}`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((err) => console.error('Błąd podczas pobierania danych:', err));

        fetch(`http://localhost:3000/api/wishlist/${userId}`)
        .then((response) => response.json())
        .then((data) => setWishlist(data))
        .catch((err) => console.error('Błąd podczas pobierania listy życzeń:', err));
    }, [id]);

    const isBookInWishlist = (bookId) => {
        return wishlist.some(book => book.id === bookId);
    };

    const handleAddToWishlist = (bookId) => {
        fetch(`http://localhost:3000/api/wishlist/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                alert(data.message);
            }
            setWishlist((prevWishlist) => [
                ...prevWishlist,
                { id: bookId },
            ]);
        })
        .catch((err) => console.error("Błąd podczas dodawania książki do listy życzeń:", err));
    };

    if (!book) {
        return <p>Ładowanie danych książki...</p>;
    }

    const publicationDate = new Date(book.data_wydania).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('.').reverse().join('-');

    const addDate = new Date(book.data_dodania).toLocaleDateString('pl-PL', {
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
                <h2>{book.tytul}</h2>
                <div className="book-container">
                    <div className="book-cover">
                        <img src={book.zdjecie_okladki} alt={`Okładka książki ${book.tytul}`} width="200" />
                    </div>
                    <div className="book-details">
                        <h3><strong>Książka użytkownika: </strong> 
                            <Link to={`/user/${book.uzytkownik_id}`}>{book.wlasciciel}</Link>
                        </h3>
                        <p><strong>Autor:</strong> {book.autor}</p>
                        <p><strong>ISBN:</strong> {book.ISBN}</p>
                        <p><strong>Data wydania:</strong> {publicationDate}</p>
                        <p><strong>Wydawnictwo:</strong> {book.wydawnictwo}</p>
                        <p><strong>Gatunek:</strong> {book.gatunek}</p>
                        <p><strong>Język:</strong> {book.jezyk}</p>
                        <p><strong>Liczba stron:</strong> {book.liczba_stron}</p>
                        <p><strong>Status:</strong> {book.status}</p>
                        <p><strong>Data dodania:</strong> {addDate}</p>
                        {book.status === 'dostępna' && book.uzytkownik_id !== parseInt(userId) && (
                            <button onClick={() => navigate(`/exchange/${book.id}`)}>Wymień się</button>
                        )}
                        {!isBookInWishlist(book.id) && book.uzytkownik_id !== parseInt(userId) &&  (
                            <button onClick={() => handleAddToWishlist(book.id)}>Dodaj do listy życzeń</button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookDetails;