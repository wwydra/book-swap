import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ExchangeList = () => {
    const [exchanges, setExchanges] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/exchanges')
        .then(response => response.json())
        .then(data => {
            const uniqueExchanges = data.reduce((acc, exchange) => {
                if (!acc.has(exchange.wymiana_id)) {
                    acc.set(exchange.wymiana_id, exchange);
                }
                return acc;
            }, new Map());

            setExchanges(Array.from(uniqueExchanges.values()));
        })
        .catch(error => console.error('Błąd podczas pobierania wymian:', error));
    }, []);

    return (
        <div>
            <header>
                <h1>BookSwap</h1>
            </header>
            <nav>
                <ul className="nav-links">
                    <li><Link to={`/home`}><p>Przeglądaj</p></Link></li>
                    <li><Link to={`/userlist`}>Lista użytkowników</Link></li>
                    <li><Link to={`/exchangelist`}>Lista wymian</Link></li>
                    <li><Link to={`/exchanges`}><p>Wymiany</p></Link></li>
                    <li><Link to={`/account`}><p>Moje konto</p></Link></li>
                    <li><Link to={`/`}><p>Wyloguj</p></Link></li>
                </ul>
            </nav>
            <main>
                <h2>Lista wymian</h2>
                <table className="exchange-table">
                    <thead>
                        <tr>
                            <th>Numer wymiany</th>
                            <th>Status wymiany</th>
                            <th>Inicjator</th>
                            <th>Odbiorca</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exchanges.length > 0 ? (
                            exchanges.map(exchange => (
                                <tr key={exchange.wymiana_id}>
                                    <td>{exchange.wymiana_id}</td>
                                    <td>{exchange.status}</td>
                                    <td>
                                        <div className="user-info-exli">
                                            <div className="user-name-exli">{exchange.inicjator_imie}</div>
                                            <div className="book-info-exli">
                                                <img 
                                                    src={exchange.inicjator_ksiazka_okladka} 
                                                    alt={`Okładka książki ${exchange.inicjator_ksiazka_tytul}`} 
                                                    className="book-cover-exli"
                                                />
                                                <div className="book-details-exli">
                                                    <div>{exchange.inicjator_ksiazka_tytul}</div>
                                                    <div>{exchange.inicjator_ksiazka_autor}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-info-exli">
                                            <div className="user-name-exli">{exchange.odbiorca_imie}</div>
                                            <div className="book-info-exli">
                                                <img 
                                                    src={exchange.odbiorca_ksiazka_okladka} 
                                                    alt={`Okładka książki ${exchange.odbiorca_ksiazka_tytul}`} 
                                                    className="book-cover-exli"
                                                />
                                                <div className="book-details-exli">
                                                    <div>{exchange.odbiorca_ksiazka_tytul}</div>
                                                    <div>{exchange.odbiorca_ksiazka_autor}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Brak wymian do wyświetlenia</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default ExchangeList;