const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bookswap',
});

connection.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.stack);
        return;
    }
    console.log('Połączono z bazą danych jako id ' + connection.threadId);
});

module.exports = connection;