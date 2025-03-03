import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const booksPerPage = 10;

    useEffect(() => {
        fetch('http://localhost:3000/api/books/')
        .then((response) => response.json())
        .then((data) => {
            const filtered = data.filter(book => book.uzytkownik_id !== parseInt(userId));
            setFilteredBooks(filtered);
        })
        .catch((error) => console.error('Błąd pobierania książek:', error));
    
        fetch(`http://localhost:3000/api/wishlist/${userId}`)
        .then((response) => response.json())
        .then((data) => setWishlist(data))
        .catch((err) => console.error('Błąd podczas pobierania listy życzeń:', err));
    }, []);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
            setWishlist((prevWishlist) => [
                ...prevWishlist,
                { id: bookId },
            ]);
        })
        .catch((err) => console.error("Błąd podczas dodawania książki do listy życzeń:", err));
    };

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
                <h2>Przeglądaj</h2>
                <ul className="book-list">
                    {currentBooks.map((book) => (
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
                                {book.status === 'dostępna' && (
                                    <button onClick={() => navigate(`/exchange/${book.id}`)}>Wymień się</button>
                                )}
                                {!isBookInWishlist(book.id) && (
                                    <button onClick={() => handleAddToWishlist(book.id)}>Dodaj do listy życzeń</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="pagination">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>Poprzednia</button>
                    <span>Strona {currentPage} z {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>Następna</button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;