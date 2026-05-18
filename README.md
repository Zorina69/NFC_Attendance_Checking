# Makerspace NFC Attendance & Credit System

A full-stack application for managing NFC-based attendance checking and material borrowing with credit deduction system in a makerspace.

## Features

### Attendance System
- NFC attendance check-in via Web NFC API
- Automatic timestamp recording
- User identification via NFC UID

### Credit System
- Store user credits in database
- Automatic deduction when borrowing materials
- Prevent borrowing if balance is insufficient

### Material Borrowing
- Borrow equipment/materials
- Transaction history logging
- Material inventory management

### Admin Features
- Register NFC cards
- Add/edit users
- Manage materials
- Track attendance records
- View borrowing history

---

## Tech Stack

**Backend:**
- Node.js with Express.js
- MySQL database
- CORS enabled

**Frontend:**
- React 19
- Vite (build tool)
- Axios (HTTP client)
- Web NFC API

---

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Modern browser with NFC support (Chrome, Edge on Android)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Zorina69/NFC_Attendance_Checking.git
cd NFC_Attendance_Checking
```

### 2. Install Dependencies

**Root dependencies:**
```bash
npm install
```

**Frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

### 3. Set Up Environment Variables

**Root `.env` file (already created):**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=1234
DB_NAME=makerspace
```

**Frontend `.env.local` file (already created):**
```
VITE_API_URL=http://localhost:5000
```

### 4. Set Up Database

**Using MySQL command line:**
```bash
mysql -u root -p < backend/schema.sql
```

Or manually run the SQL in `backend/schema.sql`:
- Creates `makerspace` database
- Creates tables: `users`, `attendance`, `materials`, `borrow_transactions`
- Sets up indexes for performance

### 5. Add Sample Data (Optional)

```sql
-- Insert sample users
INSERT INTO users (name, uid, credit) VALUES 
('John Doe', 'UID123456', 100),
('Jane Smith', 'UID789012', 150);

-- Insert sample materials
INSERT INTO materials (name, credit_cost) VALUES 
('3D Printer', 10),
('Laser Cutter', 20),
('Soldering Iron', 5);
```

---

## Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Start Backend:**
```bash
npm start
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Option 2: Run Separately

**Backend only:**
```bash
cd backend
node server.js
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

---

## API Endpoints

### Attendance
- **POST** `/attendance/check` - Record attendance
  - Body: `{ "uid": "UID123456" }`

### Users
- **POST** `/users/register` - Register new user
  - Body: `{ "name": "John", "uid": "UID123456", "credit": 100 }`

### Borrowing
- **POST** `/borrow/material` - Borrow material
  - Body: `{ "uid": "UID123456", "materialId": 1 }`

---

## Browser Compatibility

NFC functionality requires:
- Chrome/Chromium 89+ on Android
- Edge 89+ on Windows with NFC support
- Other browsers with Web NFC API support

---

## Error Handling

The application includes comprehensive error handling:
- **400 Bad Request** - Invalid or missing input
- **404 Not Found** - User or material not found
- **409 Conflict** - Duplicate UID registration
- **500 Server Error** - Database errors

---

## Security Notes

⚠️ **Important:**
- Database credentials are stored in `.env` (never commit this file)
- CORS is restricted to localhost (configure in `backend/server.js` for production)
- Use HTTPS in production
- Validate all user inputs (already implemented)

---

## Troubleshooting

### "NFC is not supported on this device"
- Ensure your device/browser supports Web NFC API
- Only supported on modern Android devices with Chrome

### "Database connected" not showing
- Check MySQL is running
- Verify credentials in `.env` match your MySQL setup
- Ensure `makerspace` database exists

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env.local`
- Check browser console for CORS errors

### "UID already registered"
- The card UID is already registered in the system
- Use a different card or check with admin

---

## Development Scripts

```bash
npm start          # Start backend server
npm run dev        # Start frontend dev server
npm run build      # Build frontend for production
npm run lint       # Run ESLint on frontend
npm run preview    # Preview production build
```

---

## Project Structure

```
NFC_Attendance_Checking/
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── schema.sql
│   └── routes/
│       ├── attendance.js
│       ├── borrow.js
│       └── users.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## License

ISC

---

## Support

For issues or questions, please create an issue on GitHub.


# Tech Stack

## Frontend
- React
- Vite
- Axios
- Web NFC API

## Backend
- Node.js
- Express.js
- MySQL

## Hardware
- Android phone/tablet with NFC
- NFC cards/tags

---

# System Architecture

```text
NFC Card
   ↓ tap
Android Device
   ↓
React Website
   ↓
Express API
   ↓
MySQL Database

Database Tables
users

Stores user information and credit balance.

attendance

Stores attendance records.

materials

Stores materials/equipment information.

borrow_transactions

Stores borrowing transaction history.

Installation
Clone Repository
git clone https://github.com/your-username/makerspace-nfc-system.git
Backend Setup
cd backend
npm install

Create .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=makerspace_nfc
PORT=5000

Start backend:

npm start
Frontend Setup
cd frontend
npm install
npm run dev
Web NFC Support

Web NFC currently works best on:

Android Chrome

Limited support:

iPhone Safari
Desktop browsers
Attendance Workflow
User taps NFC card
      ↓
Website reads UID
      ↓
Backend verifies user
      ↓
Attendance saved
Borrow Workflow
User taps NFC card
      ↓
System identifies user
      ↓
Select material
      ↓
Credit deducted
      ↓
Transaction saved
Future Improvements
QR code backup
Telegram notifications
Equipment reservation
Door access control
Offline support
Analytics dashboard
