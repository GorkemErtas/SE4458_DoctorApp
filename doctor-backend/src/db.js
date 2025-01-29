const mysql = require('mysql2');
require('dotenv').config(); // .env dosyasını yükler

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.getConnection((err) => {
    if (err) {
        console.error('MySQL bağlantı hatası:', err);
    } else {
        console.log('MySQL bağlantısı başarılı!');
    }
});

module.exports = db;
