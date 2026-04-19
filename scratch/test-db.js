const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connection successful!');
  connection.query('CREATE DATABASE IF NOT EXISTS ' + (process.env.DB_NAME || 'blood_bridge'), (err) => {
    if (err) {
      console.error('Failed to create/check database:', err.message);
    } else {
      console.log('Database checked/created.');
    }
    connection.end();
  });
});
