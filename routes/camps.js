const express = require('express');
const router = express.Router();
const axios = require('axios');

// Nearby blood camps dhundho
router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Location do' });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, // 5km radius
          keyword: 'blood bank blood donation camp',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const camps = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      open_now: place.opening_hours?.open_now ?? null,
      place_id: place.place_id
    }));

    res.json({ camps });

  } catch (error) {
    console.log('Google Places Error:', error.message);
    res.status(500).json({ error: 'Camps fetch nahi hue' });
  }
});

module.exports = router;