import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AddBook = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [publisher, setPublisher] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [pageCount, setPageCount] = useState('');
    const [coverImage, setCoverImage] = useState('');

    const validateForm = () => {
        if (!title.trim() || !author.trim() || !isbn.trim() || !publicationDate || !publisher.trim() || !genre.trim() || !language.trim()) {
            alert('Wszystkie pola (oprócz linku do okładki) muszą być wypełnione!');
            return false;
        }

        const currentDate = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');
        const publication = new Date(publicationDate).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        if (publication > currentDate) {
            alert('Data wydania nie może być w przyszłości!');
            return false;
        }

        if (pageCount <= 0 || isNaN(pageCount)) {
            alert('Liczba stron musi być większa od zera!');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newBook = {
            tytul: title,
            autor: author,
            ISBN: isbn,
            data_wydania: publicationDate,
            wydawnictwo: publisher,
            gatunek: genre,
            jezyk: language,
            liczba_stron: pageCount,
            zdjecie_okladki: coverImage,
            uzytkownik_id: userId,
        };    

        fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        })
        .then((response) => {
            if (response.ok) {
                navigate('/account');
            }
        })
        .catch((err) => {
            console.error('Błąd podczas dodawania książki:', err);
            alert('Wystąpił błąd.');
        });
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
                <h2 className="log">Dodaj książkę</h2>
                <form className="log-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Tytuł:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>Autor:</label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>
                    <div>
                        <label>ISBN:</label>
                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
                    </div>
                    <div>
                        <label>Data wydania:</label>
                        <input type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} required />
                    </div>
                    <div>
                        <label>Wydawnictwo:</label>
                        <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} required />
                    </div>
                    <div>
                        <label>Gatunek:</label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                    </div>
                    <div>
                        <label>Język:</label>
                        <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
                    </div>
                    <div>
                        <label>Liczba stron:</label>
                        <input type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} required />
                    </div>
                    <div>
                        <label>Link do okładki:</label>
                        <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
                    </div>
                    <button type="submit">Dodaj książkę</button>
                </form>
            </main>
        </div>
    );
};

export default AddBook;