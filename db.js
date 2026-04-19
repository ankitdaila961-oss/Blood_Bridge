require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'blood_bridge'
});

db.connect((err) => {
  if (err) {
    console.log('DB Error:', err.message);
    return;
  }
  console.log('MySQL Connected!');
});

module.exports = db;
