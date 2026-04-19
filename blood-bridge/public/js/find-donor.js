document.getElementById('searchBtn').addEventListener('click', searchDonors);

async function searchDonors() {
  const bloodGroup = document.getElementById('blood_group').value;
  const city = document.getElementById('city').value.trim();

  const loadingEl = document.getElementById('loading');
  const resultsEl = document.getElementById('results');

  loadingEl.style.display = 'block';
  resultsEl.innerHTML = '';

  try {
    const params = new URLSearchParams();
    if (bloodGroup) params.append('blood_group', bloodGroup);
    if (city) params.append('city', city);

    const response = await fetch(`/api/donors?${params}`);
    const donors = await response.json();

    loadingEl.style.display = 'none';

    if (response.ok) {
      // Save search to localStorage
      if (bloodGroup || city) {
        const searchLog = JSON.parse(localStorage.getItem('bb_searches') || '[]');
        searchLog.unshift({
          bloodGroup: bloodGroup || 'All',
          city: city || 'Any',
          resultsCount: donors.length,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('bb_searches', JSON.stringify(searchLog.slice(0, 10)));
      }
      displayDonors(donors);
    } else {
      resultsEl.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
  } catch (error) {
    loadingEl.style.display = 'none';
    resultsEl.innerHTML = '<p>Something went wrong. Please try again.</p>';
  }
}

function displayDonors(donors) {
  const resultsEl = document.getElementById('results');

  if (donors.length === 0) {
    resultsEl.innerHTML = '<p>No donors found. Try a different city or blood group.</p>';
    return;
  }

  if (donors.length < 3) {
    resultsEl.innerHTML += '<p style="color: #856404; background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">Very few donors found! Also post a blood request.</p>';
  }

  donors.forEach(donor => {
    const card = document.createElement('div');
    card.className = 'donor-card';

    const bloodClass = donor.blood_group.replace('+', '\\+').replace('-', '-');
    const availabilityClass = donor.available ? 'available' : 'not-available';
    const availabilityText = donor.available ? 'Available' : 'Not Available';

    card.innerHTML = `
      <div class="blood-badge ${bloodClass}">${donor.blood_group}</div>
      <h3>${donor.name}</h3>
      <p>${donor.city}</p>
      <span class="availability ${availabilityClass}">${availabilityText}</span>
      <p>Last donation: ${donor.last_donation || 'Never'}</p>
      <button class="contact-btn" onclick="toggleContact(this, '${donor.phone}', '${donor.name}')">View Contact</button>
      <div class="contact-info" style="display: none;"></div>
    `;

    resultsEl.appendChild(card);
  });
}

function toggleContact(btn, phone, name) {
  const contactInfo = btn.nextElementSibling;
  if (contactInfo.style.display === 'none') {
    contactInfo.textContent = `Phone: ${phone}`;
    contactInfo.style.display = 'block';
    btn.textContent = 'Hide Contact';

    // Save connection to localStorage
    const connectLog = JSON.parse(localStorage.getItem('bb_connections') || '[]');
    connectLog.unshift({
      name: name,
      phone: phone,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('bb_connections', JSON.stringify(connectLog.slice(0, 10)));
  } else {
    contactInfo.style.display = 'none';
    btn.textContent = 'View Contact';
  }
}