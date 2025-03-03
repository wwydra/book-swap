import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditBook = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/books/${id}`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => console.error('Błąd pobierania książki:', error));
    }, [id]);

    const handleChange = (e) => {
        setBook({
            ...book,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!book.tytul.trim() || !book.autor.trim() || !book.ISBN.trim() || !book.data_wydania || !book.wydawnictwo.trim() || !book.gatunek.trim() || !book.jezyk.trim()) {
            alert('Wszystkie pola (oprócz linku do okładki) muszą być wypełnione!');
            return false;
        }

        const currentDate = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');
        const publication = new Date(book.data_wydania).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');


        if (publication > currentDate) {
            alert('Data wydania nie może być w przyszłości!');
            return false;
        }

        if (book.liczba_stron <= 0 || isNaN(book.liczba_stron)) {
            alert('Liczba stron musi być większa od zera!');
            return false;
        }

        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        fetch(`http://localhost:3000/api/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        })
        .then((response) => response.json())
        .then(() => {
            navigate('/booklist');
        })
        .catch((error) => console.error('Błąd podczas zapisywania książki:', error));
    };

    const formattedDate = new Date(book.data_wydania).toLocaleDateString('pl-PL', {
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
                    <li><Link to={`/booklist`}>Lista książek</Link></li>
                    <li><Link to={`/exchanges`}><p>Wymiany</p></Link></li>
                    <li><Link to={`/account`}><p>Moje konto</p></Link></li>
                    <li><Link to={`/`}><p>Wyloguj</p></Link></li>
                </ul>
            </nav>
            <main>
                <h2 className="log">Edytuj książkę</h2>
                <form className="log-form" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Tytuł:</label>
                        <input
                            type="text"
                            name="tytul"
                            value={book.tytul || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Autor:</label>
                        <input
                            type="text"
                            name="autor"
                            value={book.autor || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>ISBN:</label>
                        <input
                            type="text"
                            name="isbn"
                            value={book.ISBN || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Data wydania:</label>
                        <input
                            type="date"
                            name="data_wydania"
                            value={formattedDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Wydawnictwo:</label>
                        <input
                            type="text"
                            name="wydawnictwo"
                            value={book.wydawnictwo || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Gatunek:</label>
                        <input
                            type="text"
                            name="gatunek"
                            value={book.gatunek || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Język:</label>
                        <input
                            type="text"
                            name="jezyk"
                            value={book.jezyk || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Liczba stron:</label>
                        <input
                            type="number"
                            name="liczba_stron"
                            value={book.liczba_stron || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Zdjęcie okładki (URL):</label>
                        <input
                            type="text"
                            name="zdjecie_okladki"
                            value={book.zdjecie_okladki || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <button onClick={handleSave}>Zapisz</button>
                </form>
            </main>
        </div>
    );
};

export default EditBook;