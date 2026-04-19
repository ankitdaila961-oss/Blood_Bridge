const db = require('./db');

const bloodCamps = [
  ['City Blood Bank', 'Delhi', '+91-9876543210', 28.6139, 77.2090],
  ['Metro Hospital Blood Center', 'Delhi', '+91-9876543211', 28.5355, 77.3910],
  ['Apollo Blood Services', 'Delhi', '+91-9876543212', 28.4595, 77.0266],
  ['Max Healthcare Blood Bank', 'Delhi', '+91-9876543213', 28.5244, 77.1855],
  ['Medanta Blood Center', 'Delhi', '+91-9876543214', 28.4089, 77.0589],
  ['Fortis Blood Bank', 'Delhi', '+91-9876543215', 28.6139, 77.1025],
  ['Dr Ram Manohar Lohia Hospital', 'Delhi', '+91-9876543216', 28.6353, 77.2283],
  ['All India Institute of Medical Sciences', 'Delhi', '+91-9876543217', 28.5687, 77.2295],
];

db.serialize(() => {
  bloodCamps.forEach(camp => {
    db.run(
      'INSERT OR IGNORE INTO blood_centers (name, city, phone, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      camp,
      function(err) {
        if (err) console.error('Error inserting camp:', err);
        else console.log('✅ Inserted:', camp[0]);
      }
    );
  });

  setTimeout(() => {
    console.log('✅ Blood camps setup complete!');
    db.close();
  }, 1000);
});
