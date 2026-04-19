const express = require('express');
const router = express.Router();
require('dotenv').config();

const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP Send
router.post('/send', async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Valid 10 digit phone number do' });
  }

  const otp = generateOTP();
  otpStore[phone] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000
  };

  // ✅ Terminal mein OTP dikhega
  console.log('=============================');
  console.log(`📱 Phone: ${phone}`);
  console.log(`🔑 OTP: ${otp}`);
  console.log('=============================');

  res.json({
    message: 'OTP sent successfully!',
    otp: otp  // ✅ Frontend pe bhi dikhega
  });
});

// OTP Verify
router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;

  if (!otpStore[phone]) {
    return res.status(400).json({ error: 'Pehle OTP send karo' });
  }

  if (Date.now() > otpStore[phone].expiry) {
    delete otpStore[phone];
    return res.status(400).json({ error: 'OTP expire ho gaya! Dobara bhejo' });
  }

  if (otpStore[phone].otp !== otp) {
    return res.status(400).json({ error: 'Galat OTP hai!' });
  }

  delete otpStore[phone];
  res.json({ message: 'OTP verified! ✅' });
});

module.exports = router;