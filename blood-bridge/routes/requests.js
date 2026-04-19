const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { patient_name, blood_group, city, contact, hospital, urgency } = req.body;
  db.query(
    'INSERT INTO requests (patient_name, blood_group, city, contact, hospital, urgency) VALUES (?, ?, ?, ?, ?, ?)',
    [patient_name, blood_group, city, contact, hospital, urgency],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Request posted!', id: result.insertId });
    }
  );
});

module.exports = router;