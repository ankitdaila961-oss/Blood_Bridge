require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();

// ✅ Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blood_bridge'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ MySQL Database Connected successfully');
});

// ✅ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files
app.use(express.static(path.join(__dirname, 'blood-bridge', 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
const donorRoutes = require('./routes/donors');
const requestRoutes = require('./routes/requests');
const authRoutes = require('./routes/auth');
const campsRoute = require('./routes/camps');
const alertRoutes = require('./routes/alerts');
const otpRoutes = require('./routes/otp');

app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/camps', campsRoute);
app.use('/api/alert-blood-camps', alertRoutes);
app.use('/api/otp', otpRoutes);

// ✅ Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'blood-bridge', 'public', 'index.html'));
});

// ✅ Server start (IMPORTANT FIX)
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});