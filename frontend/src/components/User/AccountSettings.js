import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AccountSettings = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({
        imie: '',
        data_urodzenia: ''
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                const birthDate = new Date(data.data_urodzenia).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('.').reverse().join('-');
                setUpdatedUser({
                    imie: data.imie,
                    data_urodzenia: birthDate,
                });
            })
            .catch((err) => console.error('Błąd podczas pobierania danych użytkownika:', err));
        }
    }, []);

    const validateUserData = () => {
        if (!updatedUser.imie.trim()) {
            alert('Imię nie może być puste!');
            return false;
        }

        if (!updatedUser.data_urodzenia) {
            alert('Data urodzenia jest wymagana!');
            return false;
        }

        const currentDate = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');
        const birthDate = new Date(updatedUser.data_urodzenia).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        if (birthDate >= currentDate) {
            alert('Data urodzenia musi być w przeszłości!');
            return false;
        }

        return true;
    };

    const handleSave = () => {
        if (!validateUserData()) return;

        const birthDate = new Date(updatedUser.data_urodzenia).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        if (userId) {
            fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            })
            .then((response) => response.json())
            .then(() => {
                setUser(prevState => ({
                    ...prevState,
                    imie: updatedUser.imie,
                    data_urodzenia: birthDate
                }));
                navigate('/account');
            })
            .catch((err) => console.error('Błąd podczas aktualizacji danych:', err));
        }
    };

    const validatePasswordData = () => {
        if (!passwords.oldPassword.trim()) {
            alert('Stare hasło jest wymagane!');
            return false;
        }

        if (passwords.newPassword.length < 6) {
            alert('Nowe hasło musi mieć co najmniej 6 znaków!');
            return false;
        }

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert('Nowe hasło i jego potwierdzenie muszą być zgodne!');
            return false;
        }

        return true;
    };

    const handleChangePassword = () => {
        if (!validatePasswordData()) return;

        if (userId) {
            fetch(`http://localhost:3000/api/users/change-password/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: passwords.newPassword,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                navigate('/account');
            })
            .catch((err) => console.error('Błąd podczas zmiany hasła:', err));
        }
    };

    if (!user) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    return (
        <div>
            <header>
                <h1>BookSwap</h1>
            </header>
            <nav >
                <ul className="nav-links">
                    <li><Link to={`/account`}><p>Moje konto</p></Link></li>            
                    <li><Link to={`/`}><p>Wyloguj</p></Link></li>
                </ul>
            </nav>
            <main>
                <h2 className="log">Ustawienia konta</h2>
                <form className="log-form">
                    <div>
                        <label htmlFor="imie">Imię:</label>
                        <input
                            type="text"
                            id="imie"
                            value={updatedUser.imie}
                            onChange={(e) => setUpdatedUser({ ...updatedUser, imie: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="dataUrodzenia">Data urodzenia:</label>
                        <input
                            type="date"
                            id="data_urodzenia"
                            value={updatedUser.data_urodzenia}
                            onChange={(e) => setUpdatedUser({ ...updatedUser, data_urodzenia: e.target.value })}
                        />
                    </div>
                    <div>
                        <button type="button" onClick={handleSave}>Zapisz zmiany</button>
                    </div>
                    <div>
                        <label htmlFor="oldPassword">Stare hasło:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">Nowe hasło:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword">Powtórz nowe hasło:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={passwords.confirmNewPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <button type="button" onClick={handleChangePassword}>Zmień hasło</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AccountSettings;
