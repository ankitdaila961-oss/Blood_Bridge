# Blood Bridge - OTP & Location-Based Registration Setup

## Features Added

✅ **OTP Verification System**
- 6-digit OTP sent to mobile number
- 10-minute expiry time
- Resend OTP functionality

✅ **Interactive Map Integration**
- Leaflet map showing Delhi with blood camps
- Live location detection via browser geolocation
- Distance calculation to nearest blood camp

✅ **Location-Based Alerts**
- Automatic notification to nearest blood camp
- User location and blood group information
- Donor contact details shared with camps

✅ **Multi-Step Registration Flow**
1. Enter donor details
2. Verify OTP
3. View map and select location
4. Complete registration

## Setup Instructions

### Step 1: Install Dependencies
Make sure you have sqlite3 package:
```bash
npm install sqlite3
```

### Step 2: Initialize Blood Camps Database
Run the setup script to populate blood camps:
```bash
cd c:\Users\HP\OneDrive\Desktop\clg2
node setup-blood-camps.js
```

You should see:
```
✅ Inserted: City Blood Bank
✅ Inserted: Metro Hospital Blood Center
... (more camps)
✅ Blood camps setup complete!
```

### Step 3: Start the Server
```bash
node server.js
```

You should see:
```
✅ SQLite Database Connected!
✅ Server running on http://localhost:3000
```

### Step 4: Test the Registration Flow

1. **Visit Registration Page**: http://localhost:3000/blood-bridge/public/register.html

2. **Enter Donor Details**:
   - Full Name
   - Blood Group
   - City (Default: Delhi)
   - Phone Number (10 digits)
   - Last Donation Date (optional)
   - Availability checkbox

3. **Click "Send OTP"**
   - OTP will be logged in terminal
   - Copy and enter the 6 digits

4. **Verify OTP**
   - Click "Verify OTP"
   - Browser will request location access
   - Accept to show accurate map

5. **View Blood Camps Map**
   - Interactive map shows all Delhi blood camps
   - Red circle = Your location
   - Blue markers = Blood camps
   - Nearest camp info displayed

6. **Complete Registration**
   - Alert sent to nearest blood camp
   - Donor info includes location & blood group
   - Redirected to home page

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP code

### Blood Camps
- `GET /api/blood-camps` - Get all blood camps
- `POST /api/blood-camps/nearby` - Get nearby camps (radius-based)

### Alerts
- `POST /api/alert-blood-camps` - Send donor alert to camps
- `GET /api/alert-blood-camps/camp/:campName` - Get recent alerts for camp

### Donors
- `GET /api/donors` - Get all donors (with filters)
- `POST /api/donors` - Register new donor
- `DELETE /api/donors/:id` - Remove donor

### Requests
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create blood request

## Database Tables Created

1. **donors** - Donor profiles with location data
2. **blood_centers** - Blood camp locations
3. **requests** - Blood requests
4. **donor_alerts** - Alerts sent to camps

## Testing OTP

In development mode, OTP is logged in console:
```
📱 OTP for 9876543210: 123456
```

**For Production**: Replace console log with SMS service (Twilio, AWS SNS, etc.)

## Error Troubleshooting

### "OTP not found" Error
- Make sure to click "Send OTP" first
- OTP expires after 10 minutes

### "Cannot find blood camps" Error
- Run `node setup-blood-camps.js` to initialize database
- Make sure blood_bridge.db exists in clg2 folder

### Map not loading
- Check browser console for errors
- Enable geolocation in browser settings
- For testing, app defaults to Delhi center (28.7041, 77.1025)

### "Module not found" Error
- Run `npm install` to install all dependencies
- Check that all route files exist in `routes/` folder

## File Structure

```
clg2/
├── server.js (updated with new routes)
├── db.js (SQLite setup)
├── setup-blood-camps.js (initialize data)
├── package.json
├── routes/
│   ├── donors.js (updated for SQLite)
│   ├── requests.js (updated for SQLite)
│   ├── auth.js (NEW - OTP)
│   ├── camps.js (NEW - blood camps)
│   └── alerts.js (NEW - notifications)
├── blood-bridge/
│   └── public/
│       ├── index.html
│       ├── register.html (updated with OTP + map)
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── register.js (updated with OTP + map)
└── blood_bridge.db (created after first run)
```

## Next Steps (Optional Enhancements)

1. **Real SMS Integration**: Connect Twilio or AWS SNS
2. **Email Notifications**: Send alerts to camp emails
3. **Database Persistence**: Store OTPs in SQLite instead of memory
4. **Advanced Analytics**: Track donor registrations and camp responses
5. **Admin Dashboard**: View all alerts and registrations
6. **Mobile App**: React Native or Flutter frontend

## Support

For issues or updates, check:
- Terminal logs for error messages
- browser console (F12) for frontend errors
- blood_bridge.db with SQLite Browser

Happy Registering! 🩸
