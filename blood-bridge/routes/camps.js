const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Location do' });
  }

  try {
    // ✅ Overpass API - FREE, no key needed
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:5000,${lat},${lng});
        node["amenity"="clinic"](around:5000,${lat},${lng});
        node["healthcare"="blood_bank"](around:5000,${lat},${lng});
        node["amenity"="blood_bank"](around:5000,${lat},${lng});
        way["amenity"="hospital"](around:5000,${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    const elements = response.data.elements;

    if (!elements || elements.length === 0) {
      return res.json({ camps: [] });
    }

    // ✅ Filter karo sirf jinke coordinates hain
    const camps = elements
      .filter(el => el.lat && el.lon && el.tags && el.tags.name)
      .map(el => ({
        name: el.tags.name || 'Unknown',
        address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address unavailable',
        lat: el.lat,
        lng: el.lon,
        rating: 'N/A',
        open_now: null,
        type: el.tags.amenity || el.tags.healthcare || 'hospital'
      }))
      .slice(0, 10); // Max 10 camps

    console.log(`✅ Found ${camps.length} camps near ${lat}, ${lng}`);
    res.json({ camps });

  } catch (error) {
    console.error('Overpass API Error:', error.message);
    res.status(500).json({ error: 'Camps fetch nahi hue' });
  }
});

module.exports = router;