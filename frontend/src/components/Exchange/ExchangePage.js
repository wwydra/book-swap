import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ExchangePage = () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const [exchanges, setExchanges] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/exchanges/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setExchanges(data);
            } else {
                setExchanges([]);
            }
        })
        .catch((err) => {
            console.error('Błąd podczas pobierania wymian użytkownika:', err);
        });
    }, []);

    const pendingExchanges = exchanges.length === 0 ? 0 : exchanges.filter((exchange) => exchange.status === 'oczekuje');
    const acceptedExchanges = exchanges.length === 0 ? 0 : exchanges.filter((exchange) => exchange.status === 'zaakceptowana');
    const rejectedExchanges = exchanges.length === 0 ? 0 : exchanges.filter((exchange) => exchange.status === 'odrzucona');
    const completedExchanges = exchanges.length === 0 ? 0 : exchanges.filter((exchange) => exchange.status === 'zakończona');

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
                <h2>Moje wymiany</h2>
                <div className="exchange-sections">
                    <div className="exchange-section">
                        <h3 className="exchange-section-title">Oczekujące</h3>
                        {pendingExchanges.length > 0 ? (
                            <ul className="exchange-list">
                                {pendingExchanges.map((exchange) => (
                                    <li key={exchange.id} className="exchange-item">
                                        <Link to={`/exchange-details/${exchange.wymiana_id}`} className="exchange-link">
                                            <img
                                                src={exchange.zdjecie_okladki}
                                                alt={`Okładka książki ${exchange.tytul}`}
                                                className="exchange-image"
                                            />
                                            <div className="exchange-details">
                                                <p className="exchange-title">{exchange.tytul}</p>
                                                <p className="exchange-author">{exchange.autor}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-exchanges">Brak oczekujących wymian.</p>
                        )}
                    </div>

                    <div className="exchange-section">
                        <h3 className="exchange-section-title">Zaakceptowane</h3>
                        {acceptedExchanges.length > 0 ? (
                            <ul className="exchange-list">
                                {acceptedExchanges.map((exchange) => (
                                    <li key={exchange.id} className="exchange-item">
                                        <Link to={`/exchange-details/${exchange.wymiana_id}`} className="exchange-link">
                                            <img
                                                src={exchange.zdjecie_okladki}
                                                alt={`Okładka książki ${exchange.tytul}`}
                                                className="exchange-image"
                                            />
                                            <div className="exchange-details">
                                                <p className="exchange-title">{exchange.tytul}</p>
                                                <p className="exchange-author">{exchange.autor}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-exchanges">Brak zaakceptowanych wymian.</p>
                        )}
                    </div>

                    <div className="exchange-section">
                        <h3 className="exchange-section-title">Zakończone</h3>
                        {completedExchanges.length > 0 ? (
                            <ul className="exchange-list">
                                {completedExchanges.map((exchange) => (
                                    <li key={exchange.id} className="exchange-item">
                                        <Link to={`/exchange-details/${exchange.wymiana_id}`} className="exchange-link">
                                            <img
                                                src={exchange.zdjecie_okladki}
                                                alt={`Okładka książki ${exchange.tytul}`}
                                                className="exchange-image"
                                            />
                                            <div className="exchange-details">
                                                <p className="exchange-title">{exchange.tytul}</p>
                                                <p className="exchange-author">{exchange.autor}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-exchanges">Brak zakończonych wymian.</p>
                        )}
                    </div>

                    <div className="exchange-section">
                        <h3 className="exchange-section-title">Odrzucone</h3>
                        {rejectedExchanges.length > 0 ? (
                            <ul className="exchange-list">
                                {rejectedExchanges.map((exchange) => (
                                    <li key={exchange.id} className="exchange-item">
                                        <Link to={`/exchange-details/${exchange.wymiana_id}`} className="exchange-link">
                                            <img
                                                src={exchange.zdjecie_okladki}
                                                alt={`Okładka książki ${exchange.tytul}`}
                                                className="exchange-image"
                                            />
                                            <div className="exchange-details">
                                                <p className="exchange-title">{exchange.tytul}</p>
                                                <p className="exchange-author">{exchange.autor}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-exchanges">Brak odrzuconych wymian.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExchangePage;