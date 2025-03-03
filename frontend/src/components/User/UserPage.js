import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const UserPage  = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const { userIdPage } = useParams();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [reviews, setReviews] = useState({
        sredniaOcena: null,
        komentarze: [],
    });
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (userIdPage) {
            fetch(`http://localhost:3000/api/users/${userIdPage}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((err) => console.error('Błąd podczas pobierania danych użytkownika:', err));

            fetch(`http://localhost:3000/api/books/user/${userIdPage}`)
            .then((response) => response.json())
            .then((data) => setBooks(data))
            .catch((err) => console.error('Błąd podczas pobierania książek użytkownika:', err));

            fetch(`http://localhost:3000/api/users/${userIdPage}/reviews`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((err) => console.error('Błąd podczas pobierania recenzji użytkownika:', err));
        
            fetch(`http://localhost:3000/api/wishlist/${userId}`)
            .then((response) => response.json())
            .then((data) => setWishlist(data))
            .catch((err) => console.error('Błąd podczas pobierania listy życzeń:', err));
        }
    }, [userIdPage]);

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
                <h2>{user.imie}</h2>
                <div className="account-container">
                    <div className="left-section">
                        <div className="user-data">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Data urodzenia:</strong> {birthDate}</p>
                        </div>
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
                    </div>
                    <div className="right-section">
                        <div className="my-books-header">
                            <h3>Książki użytkownika:</h3>
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
                                            {book.status === 'dostępna' && (
                                                <button onClick={() => navigate(`/exchange/${book.id}`)}>Wymień się</button>
                                            )}
                                            {!isBookInWishlist(book.id) && (
                                                <button onClick={() => handleAddToWishlist(book.id)}>Dodaj do listy życzeń</button>
                                            )}  
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>Brak dodanych książek.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPage;