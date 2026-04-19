document.getElementById('requestForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
        await submitRequest();
      },
      async (error) => {
        console.warn('Geolocation error:', error);
        // Submit without location
        await submitRequest();
      }
    );
  } else {
    // Submit without location
    await submitRequest();
  }
});

async function submitRequest() {
  const formData = new FormData(document.getElementById('requestForm'));
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Blood request posted successfully!', 'success');
      document.getElementById('requestForm').reset();
      loadRequests(); // Reload requests
    } else {
      showMessage(result.error || 'Something went wrong. Please try again.', 'error');
    }
  } catch (error) {
    showMessage('Something went wrong. Please try again.', 'error');
  }
}

function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

async function loadRequests() {
  try {
    const response = await fetch('/api/requests');
    const requests = await response.json();

    if (response.ok) {
      displayRequests(requests);
    }
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

function displayRequests(requests) {
  const feedEl = document.getElementById('requestsFeed');
  feedEl.innerHTML = '';

  requests.forEach(request => {
    const card = document.createElement('div');
    card.className = `request-card ${request.urgency.toLowerCase()}`;

    const timeAgo = getTimeAgo(new Date(request.created_at));

    card.innerHTML = `
      <h4>${request.patient_name}</h4>
      <p><strong>Blood Group:</strong> ${request.blood_group}</p>
      <p><strong>City:</strong> ${request.city}</p>
      <p><strong>Hospital:</strong> ${request.hospital || 'Not specified'}</p>
      <p><strong>Contact:</strong> ${request.contact}</p>
      <p><strong>Posted:</strong> ${timeAgo}</p>
    `;

    feedEl.appendChild(card);
  });
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Load requests on page load
loadRequests();