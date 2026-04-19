document.addEventListener('DOMContentLoaded', () => {

  let otpVerified = false;
  const BASE_URL = window.location.origin; // ✅ Ngrok ke liye fix

  // ─── OTP Input: auto-advance & backspace ───────────────────────
  const otpInputs = document.querySelectorAll('.otp-input');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      if (val && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      otpInputs.forEach((inp, i) => { inp.value = pasted[i] || ''; });
      otpInputs[Math.min(pasted.length, 5)].focus();
      e.preventDefault();
    });
  });

  function showOtpMsg(msg, type) {
    const el = document.getElementById('otpMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = `message ${type}`;
    el.style.display = 'block';
  }

  let timerInterval = null;

  function startTimer() {
    let seconds = 300;
    clearInterval(timerInterval);
    const resendBtn = document.getElementById('resendOtpBtn');
    if (!resendBtn) return;
    resendBtn.disabled = true;

    timerInterval = setInterval(() => {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      resendBtn.textContent = `Resend OTP (${m}:${s})`;
      seconds--;

      if (seconds < 0) {
        clearInterval(timerInterval);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend OTP';
        showOtpMsg('OTP expire ho gaya! Resend karo.', 'error');
      }
    }, 1000);
  }

  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const phone = document.getElementById('phone').value.trim();
      const name = document.getElementById('name').value.trim();
      const blood_group = document.getElementById('blood_group').value;
      const city = document.getElementById('city').value.trim();

      if (!name || !blood_group || !city || !phone) {
        alert('Saari required fields bharni zaroori hain!');
        return;
      }
      if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        alert('Valid 10 digit phone number daalo!');
        return;
      }

      const phoneDisplay = document.getElementById('phoneDisplay');
      if (phoneDisplay) phoneDisplay.textContent = '+91 ' + phone;

      document.getElementById('step1')?.classList.remove('active');
      document.getElementById('step2')?.classList.add('active');

      try {
        const res = await fetch(`${BASE_URL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();

        if (res.ok) {
          showOtpMsg(`✅ OTP ready! Terminal mein dekho 👉 OTP: ${data.otp}`, 'success');
          startTimer();
          if (otpInputs[0]) otpInputs[0].focus();
        } else {
          showOtpMsg('❌ ' + (data.error || 'OTP error'), 'error');
        }
      } catch (err) {
        console.error('OTP Send Error:', err);
        showOtpMsg('❌ Server se connect nahi ho paya!', 'error');
      }
    });
  }

  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', async () => {
      const phone = document.getElementById('phone').value.trim();
      const otp = Array.from(otpInputs).map(i => i.value).join('');

      if (otp.length !== 6) {
        showOtpMsg('Poora 6-digit OTP daalo!', 'error');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp })
        });
        const data = await res.json();

        if (res.ok) {
          otpVerified = true;
          clearInterval(timerInterval);
          showOtpMsg('✅ Phone verified! Registration ho raha hai...', 'success');
          verifyOtpBtn.disabled = true;
          document.getElementById('resendOtpBtn').disabled = true;
          await submitRegistration();
        } else {
          showOtpMsg('❌ ' + (data.error || 'Verification failed'), 'error');
          otpInputs.forEach(i => { i.value = ''; });
          if (otpInputs[0]) otpInputs[0].focus();
        }
      } catch (err) {
        showOtpMsg('❌ Server error! Dobara try karo.', 'error');
      }
    });
  }

  const resendOtpBtn = document.getElementById('resendOtpBtn');
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', async () => {
      const phone = document.getElementById('phone').value.trim();
      if (!phone) { showOtpMsg('Phone number fill karo pehle!', 'error'); return; }

      try {
        const res = await fetch(`${BASE_URL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();

        if (res.ok) {
          showOtpMsg(`✅ Naya OTP: ${data.otp}`, 'success');
          otpInputs.forEach(i => { i.value = ''; });
          if (otpInputs[0]) otpInputs[0].focus();
          startTimer();
        } else {
          showOtpMsg('❌ ' + (data.error || 'Resend error'), 'error');
        }
      } catch (err) {
        showOtpMsg('❌ Server error!', 'error');
      }
    });
  }

  async function submitRegistration() {
    const name = document.getElementById('name').value.trim();
    const blood_group = document.getElementById('blood_group').value;
    const city = document.getElementById('city').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const last_donation = document.getElementById('last_donation').value;
    const available = document.getElementById('available').checked ? 1 : 0;

    try {
      const res = await fetch(`${BASE_URL}/api/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, blood_group, city, phone, last_donation, available })
      });
      const data = await res.json();

      if (res.ok) {
        document.getElementById('step2')?.classList.remove('active');
        document.getElementById('step3')?.classList.add('active');

        const mapSection = document.getElementById('mapSection');
        if (mapSection) {
          mapSection.style.display = 'block';
          mapSection.scrollIntoView({ behavior: 'smooth' });
        }

        showOtpMsg('🎉 Registration successful! Ab nearby camps dekho neeche.', 'success');
        initMap();

      } else {
        showOtpMsg('❌ Registration failed: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      showOtpMsg('❌ Server se connect nahi ho paya!', 'error');
    }
  }

  function initMap() {
    if (!navigator.geolocation) {
      document.getElementById('nearestCamp').textContent = 'Geolocation supported nahi hai tumhare browser mein.';
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const map = L.map('map').setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup('📍 Tumhari Location')
        .openPopup();

      try {
        const res = await fetch(`${BASE_URL}/api/camps/nearby?lat=${lat}&lng=${lng}`);
        const data = await res.json();

        if (data.camps && data.camps.length > 0) {
          const nearest = data.camps[0];
          document.getElementById('nearestCamp').innerHTML = `
            <strong>${nearest.name}</strong><br>
            📍 ${nearest.address}<br>
            ⭐ Rating: ${nearest.rating}
          `;

          data.camps.forEach(camp => {
            L.marker([camp.lat, camp.lng], {
              icon: L.divIcon({
                html: '🏥',
                className: 'camp-marker',
                iconSize: [30, 30]
              })
            })
              .addTo(map)
              .bindPopup(`
              <b>${camp.name}</b><br>
              📍 ${camp.address}<br>
              ⭐ ${camp.rating}
            `);
          });

          sendCampAlert(lat, lng, nearest);

        } else {
          document.getElementById('nearestCamp').textContent = 'Koi blood camp nahi mila 5km mein.';
        }
      } catch (err) {
        console.error('Camps fetch error:', err);
        document.getElementById('nearestCamp').textContent = 'Camps load nahi hue.';
      }

    }, (err) => {
      document.getElementById('nearestCamp').textContent = '⚠️ Location access allow karo browser mein!';
    });
  }

  async function sendCampAlert(lat, lng, nearest) {
    const name = document.getElementById('name').value.trim();
    const blood_group = document.getElementById('blood_group').value;
    const phone = document.getElementById('phone').value.trim();

    try {
      await fetch(`${BASE_URL}/api/alert-blood-camps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: name,
          blood_group,
          phone,
          location: { lat, lng },
          nearest_camp: nearest
        })
      });
      console.log('✅ Alert sent to nearest camp:', nearest.name);
    } catch (err) {
      console.error('Alert error:', err);
    }
  }

  const completeBtn = document.getElementById('completeRegBtn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      window.location.href = '/find-donor.html';
    });
  }

});