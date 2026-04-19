#!/usr/bin/env node

console.log('\n🧪 Blood Bridge System Test\n');
console.log('=' .repeat(50));

// Test 1: Database Connection
console.log('\n1️⃣ Testing Database...');
const db = require('./db');
db.get("SELECT 1", (err) => {
  if (err) {
    console.error('❌ Database Error:', err.message);
  } else {
    console.log('✅ Database Connected!');
  }
});

// Test 2: Routes Exist
console.log('\n2️⃣ Checking Routes...');
const fs = require('fs');
const routes = ['auth.js', 'camps.js', 'alerts.js', 'donors.js', 'requests.js'];
routes.forEach(route => {
  const path = `./routes/${route}`;
  if (fs.existsSync(path)) {
    console.log(`✅ ${route} found`);
  } else {
    console.log(`❌ ${route} NOT FOUND`);
  }
});

// Test 3: HTML Files
console.log('\n3️⃣ Checking HTML Files...');
const htmlFiles = [
  'blood-bridge/public/register.html',
  'blood-bridge/public/index.html'
];
htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} NOT FOUND`);
  }
});

// Test 4: Check Tables
console.log('\n4️⃣ Checking Database Tables...');
setTimeout(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Error:', err.message);
    } else {
      const tableNames = tables.map(t => t.name);
      ['donors', 'blood_centers', 'requests', 'donor_alerts'].forEach(table => {
        if (tableNames.includes(table)) {
          console.log(`✅ Table '${table}' exists`);
        } else {
          console.log(`❌ Table '${table}' MISSING`);
        }
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ System test complete!\n');
    console.log('Next steps:');
    console.log('1. Run: node setup-blood-camps.js');
    console.log('2. Run: node server.js');
    console.log('3. Visit: http://localhost:3000/blood-bridge/public/register.html\n');
    
    db.close();
  });
}, 500);
