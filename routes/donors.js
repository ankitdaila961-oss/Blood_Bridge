const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { blood_group, city } = req.query;
  let query = 'SELECT * FROM donors WHERE 1=1';
  const params = [];

  if (blood_group) {
    query += ' AND blood_group = ?';
    params.push(blood_group);
  }
  if (city) {
    query += ' AND city LIKE ?';
    params.push('%' + city + '%');
  }

  query += ' ORDER BY available DESC, created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, blood_group, city, phone, last_donation, available } = req.body;

  if (!name || !blood_group || !city || !phone) {
    return res.status(400).json({ error: 'Saari fields required hain!' });
  }

  const query = 'INSERT INTO donors (name, blood_group, city, phone, last_donation, available) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, blood_group, city, phone, last_donation || null, available || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Donor registered!', id: result.insertId });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM donors WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Donor deleted!' });
  });
});

module.exports = router;
