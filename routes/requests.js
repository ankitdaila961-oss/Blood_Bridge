const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

router.post('/', (req, res) => {
  const { patient_name, blood_group, city, contact, hospital, urgency } = req.body;
  db.run('INSERT INTO requests (patient_name, blood_group, city, contact, hospital, urgency) VALUES (?, ?, ?, ?, ?, ?)',
  [patient_name, blood_group, city, contact, hospital, urgency], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Request posted!', id: this.lastID });
  });
});

module.exports = router;

