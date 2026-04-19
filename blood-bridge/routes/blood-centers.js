const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/blood-centers — fetch all blood centers
router.get('/', (req, res) => {
  const query = 'SELECT * FROM blood_centers';

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST /api/blood-centers — add new blood center
router.post('/', (req, res) => {
  const { name, city, phone, latitude, longitude } = req.body;
  const query = 'INSERT INTO blood_centers (name, city, phone, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
  const params = [name, city, phone, latitude, longitude];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Blood center added successfully', id: this.lastID });
  });
});

// GET /api/blood-centers/nearby — find nearby blood centers based on lat/lng
router.get('/nearby', (req, res) => {
  const { lat, lng, radius = 50 } = req.query; // radius in km
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  const query = `
    SELECT *,
           (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
    FROM blood_centers
    HAVING distance < ?
    ORDER BY distance
  `;

  db.all(query, [lat, lng, lat, radius], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;