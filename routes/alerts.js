const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blood_bridge'
});

db.connect((err) => {
  if (err) {
    console.error('Alerts DB connection failed:', err);
  } else {
    console.log('✅ Alerts DB Connected');
    db.query(`
      CREATE TABLE IF NOT EXISTS donor_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_name VARCHAR(255),
        blood_group VARCHAR(10),
        phone VARCHAR(15),
        camp_name VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Table create error:', err);
      else console.log('✅ donor_alerts table ready');
    });
  }
});

// Alert bhejo
router.post('/', (req, res) => {
  const { donor_name, blood_group, location, nearest_camp, phone } = req.body;

  if (!donor_name || !blood_group || !phone || !location || !nearest_camp) {
    return res.status(400).json({ error: 'Sabhi fields bharo!' });
  }

  const alertMessage = `🩸 New Donor Alert!
Name: ${donor_name}
Blood Group: ${blood_group}
Location: Lat ${parseFloat(location.lat).toFixed(4)}, Lng ${parseFloat(location.lng).toFixed(4)}
Contact: ${phone}
Nearest Camp: ${nearest_camp.name}`;

  console.log('📢 ' + alertMessage);

  db.query(
    'INSERT INTO donor_alerts (donor_name, blood_group, phone, camp_name, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
    [donor_name, blood_group, phone, nearest_camp.name, location.lat, location.lng],
    (err) => {
      if (err) {
        console.error('Alert store error:', err);
        return res.status(500).json({ error: 'Alert save nahi hua' });
      }
      res.json({
        success: true,
        message: '✅ Alert bhej diya gaya!'
      });
    }
  );
});

// Specific camp ke alerts
router.get('/camp/:campName', (req, res) => {
  const { campName } = req.params;
  db.query(
    'SELECT * FROM donor_alerts WHERE camp_name = ? ORDER BY created_at DESC LIMIT 10',
    [campName],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results || []);
    }
  );
});

// Sabhi alerts
router.get('/all', (req, res) => {
  db.query(
    'SELECT * FROM donor_alerts ORDER BY created_at DESC LIMIT 50',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results || []);
    }
  );
});

module.exports = router;