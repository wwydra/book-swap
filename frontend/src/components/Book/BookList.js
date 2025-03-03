import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookList = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    useEffect(() => {
        fetch('http://localhost:3000/api/books/')
        .then((response) => response.json())
        .then((data) => {
            setBooks(data);
        })
        .catch((error) => console.error('Błąd pobierania książek:', error));
    }, []);

    const totalPages = Math.ceil(books.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = books.slice(startIndex, endIndex);

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
                    <li><Link to={`/exchanges`}><p>Wymiany</p></Link></li>
                    <li><Link to={`/account`}><p>Moje konto</p></Link></li>
                    <li><Link to={`/`}><p>Wyloguj</p></Link></li>
                </ul>
            </nav>
            <main>
                <h2>Lista książek</h2>
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
                                <button onClick={() => navigate(`/books/edit/${book.id}`)}>Edytuj</button>
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

export default BookList;