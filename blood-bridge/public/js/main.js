const heroCard = document.getElementById('heroCard');
const heroSection = document.querySelector('.hero');

// Hero Card 3D Animation
if (heroCard && heroSection) {
  heroSection.addEventListener('mousemove', (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateY = (x - centerX) / centerX * 10;
    const rotateX = (centerY - y) / centerY * 10;

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// Activity Drawer Logic
const activityDrawer = document.getElementById('activityDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerTitle = document.getElementById('drawerTitle');
const drawerBody = document.getElementById('drawerBody');
const closeDrawer = document.getElementById('closeDrawer');

const steps = {
  'step-register': { title: 'Registration History', key: 'bb_registration', icon: '📝' },
  'step-search': { title: 'Search History', key: 'bb_searches', icon: '🔍' },
  'step-connect': { title: 'Connection History', key: 'bb_connections', icon: '🤝' }
};

Object.keys(steps).forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', () => {
      // Add processing effect
      el.classList.add('processing');
      
      // Simulate a small processing delay for better UX
      setTimeout(() => {
        el.classList.remove('processing');
        openDrawer(id);
      }, 1000);
    });
  }
});

function openDrawer(stepId) {
  const config = steps[stepId];
  const data = JSON.parse(localStorage.getItem(config.key) || '[]');
  
  drawerTitle.textContent = config.title;
  renderActivity(data, config);
  
  activityDrawer.classList.add('active');
  drawerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderActivity(data, config) {
  drawerBody.innerHTML = '';
  
  if (data.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-activity">
        <span class="icon">${config.icon}</span>
        <p>No activity found for this step yet.</p>
        <a href="${config.key === 'bb_registration' ? 'register.html' : 'find-donor.html'}" class="btn btn-primary" style="margin-top: 1rem;">Get Started</a>
      </div>
    `;
    return;
  }

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    let details = '';
    if (config.key === 'bb_registration') {
      details = `<p><strong>${item.name}</strong> registered in ${item.city}</p><p>Group: ${item.blood_group}</p>`;
    } else if (config.key === 'bb_searches') {
      details = `<p>Searched for <strong>${item.bloodGroup}</strong> in <strong>${item.city}</strong></p><p>Found ${item.resultsCount} donors</p>`;
    } else if (config.key === 'bb_connections') {
      details = `<p>Viewed contact for <strong>${item.name}</strong></p><p>Phone: ${item.phone}</p>`;
    }

    div.innerHTML = `
      <h4>${config.icon} Activity Log</h4>
      ${details}
      <p class="timestamp">${new Date(item.timestamp).toLocaleString()}</p>
    `;
    drawerBody.appendChild(div);
  });
}

function closeDrawerFunc() {
  activityDrawer.classList.remove('active');
  drawerOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerFunc);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawerFunc);
