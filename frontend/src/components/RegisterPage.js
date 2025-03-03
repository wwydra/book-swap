import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [haslo, setHaslo] = useState('');
    const [powtorzHaslo, setPowtorzHaslo] = useState('');
    const [imie, setImie] = useState('');
    const [dataUrodzenia, setDataUrodzenia] = useState('');

    const validateUserData = () => {
        if (!imie.trim()) {
            alert('Imię nie może być puste!');
            return false;
        }

        if (!dataUrodzenia) {
            alert('Data urodzenia jest wymagana!');
            return false;
        }

        const currentDate = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');
        const birthDate = new Date(dataUrodzenia).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        if (birthDate >= currentDate) {
            alert('Data urodzenia musi być w przeszłości!');
            return false;
        }

        if (haslo.length < 6) {
            alert('Nowe hasło musi mieć co najmniej 6 znaków!');
            return false;
        }

        if (haslo !== powtorzHaslo) {
            alert('Nowe hasło i jego potwierdzenie muszą być zgodne!');
            return false;
        }

        return true;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!validateUserData()) return;

        const birthDate = new Date(dataUrodzenia).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                haslo,
                imie,
                data_urodzenia: birthDate
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Użytkownik został zarejestrowany') {
                navigate('/');
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Błąd rejestracji');
        });
    };

    return (
        <div>
            <header>
                <h1>BookSwap</h1>
            </header>
            <main>
                <h2 className="log">Rejestracja</h2>
                <form className="log-form" onSubmit={handleRegister}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Hasło:</label>
                        <input
                            type="password"
                            value={haslo}
                            onChange={(e) => setHaslo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Powtórz hasło:</label>
                        <input
                            type="password"
                            value={powtorzHaslo}
                            onChange={(e) => setPowtorzHaslo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Imię:</label>
                        <input
                            type="text"
                            value={imie}
                            onChange={(e) => setImie(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Data urodzenia:</label>
                        <input
                            type="date"
                            value={dataUrodzenia}
                            onChange={(e) => setDataUrodzenia(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Zarejestruj</button>
                </form>
                <p className="log-p">Masz już konto? <Link to="/">Zaloguj się</Link></p>
            </main>
        </div>
    );
};

export default RegisterPage;