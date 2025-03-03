import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [haslo, setHaslo] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                haslo
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Zalogowano pomyślnie') {
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userRole', data.userRole);
                navigate('/home');
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Błąd logowania');
        });
    };

    return (
        <div>
            <header>
                <h1>BookSwap</h1>
            </header>
            <main>
                <h2 className="log">Logowanie</h2>
                <form className="log-form" onSubmit={handleLogin}>
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
                    <button type="submit">Zaloguj</button>
                </form>
                <p className="log-p">Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
            </main>
        </div>
    );
};

export default LoginPage;