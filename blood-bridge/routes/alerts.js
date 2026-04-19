const express = require('express');
const router = express.Router();
const db = require('../db');

// Send alert to blood camps about new donor
router.post('/alert-blood-camps', (req, res) => {
  const { donor_name, blood_group, location, nearest_camp, phone } = req.body;

  // Create alert record
  const alertMessage = `🩸 New Donor Alert! 
Name: ${donor_name}
Blood Group: ${blood_group}
Location: Lat ${location.lat.toFixed(4)}, Lng ${location.lng.toFixed(4)}
Contact: ${phone}
Nearest Camp: ${nearest_camp.name}`;

  console.log('📢 ' + alertMessage);

  // In production, send SMS/Email to blood camps
  // Example: Send SMS via Twilio to nearest_camp.phone
  
  // Store alert in database
  db.query(
    'INSERT INTO donor_alerts (donor_name, blood_group, phone, camp_name, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
    [donor_name, blood_group, phone, nearest_camp.name, location.lat, location.lng],
    (err) => {
      if (err) {
        console.error('Error storing alert:', err);
        return res.status(500).json({ error: 'Failed to send alert' });
      }
      res.json({ success: true, message: 'Alert sent to blood camps' });
    }
  );
});

// Get alerts for a specific camp
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

module.exports = router;
