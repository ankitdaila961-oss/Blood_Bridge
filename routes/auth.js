const express = require('express');
const router = express.Router();

// Store OTPs in memory (for production, use Redis or database)
const otpStore = {};

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
router.post('/send-otp', (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const otp = generateOTP();
  otpStore[phone] = { otp, createdAt: Date.now(), name };

  // Log OTP (in production, send via SMS service like Twilio)
  console.log(`📱 OTP for ${phone}: ${otp}`);

  // Simulate SMS sending
  res.json({ 
    success: true, 
    message: 'OTP sent successfully',
    otp: otp // For testing only - remove in production
  });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!otpStore[phone]) {
    return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
  }

  const storedOTP = otpStore[phone];

  // Check OTP expiry (10 minutes)
  if (Date.now() - storedOTP.createdAt > 10 * 60 * 1000) {
    delete otpStore[phone];
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (storedOTP.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // OTP verified - delete it
  delete otpStore[phone];

  res.json({ 
    success: true, 
    message: 'OTP verified successfully'
  });
});

module.exports = router;
