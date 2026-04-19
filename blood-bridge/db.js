const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'blood_bridge.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Donors table
  db.run(`CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    last_donation DATE,
    available INTEGER DEFAULT 1,
    latitude REAL,
    longitude REAL,
    nearest_camp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Blood centers table
  db.run(`CREATE TABLE IF NOT EXISTS blood_centers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Blood requests table
  db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    city TEXT NOT NULL,
    contact TEXT NOT NULL,
    hospital TEXT NOT NULL,
    urgency TEXT DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Donor alerts table
  db.run(`CREATE TABLE IF NOT EXISTS donor_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    phone TEXT NOT NULL,
    camp_name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('✅ SQLite Database Connected!');
});

module.exports = db;