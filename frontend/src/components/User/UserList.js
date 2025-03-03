import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserList = () => {
    const userRole = localStorage.getItem('userRole');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Błąd podczas pobierania użytkowników:', error));
    }, []);

    const handleRoleChange = (userId, newRole) => {
        fetch(`http://localhost:3000/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rola: newRole }),
        })
        .then(response => response.json())
        .then(() => {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, rola: newRole } : user
                )
            );
        })
        .catch(error => console.error('Błąd podczas zmiany roli użytkownika:', error));
    };

    return (
        <div>
            <header>
                <h1>BookSwap</h1>
            </header>
            <nav>
                <ul className="nav-links">
                    <li><Link to={`/home`}><p>Przeglądaj</p></Link></li>
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
                <h2>Lista użytkowników</h2>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Email</th>
                            <th>Rola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.imie}</td>
                                    <td>{user.email}</td>
                                    <td>
                                    <select
                                        value={user.rola}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={user.rola === 'administrator'}
                                    >
                                        <option value="administrator">administrator</option>
                                        <option value="bibliotekarz">bibliotekarz</option>
                                        <option value="zalogowany">zalogowany</option>
                                    </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Brak użytkowników do wyświetlenia</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default UserList;