# Makerspace NFC Attendance & Credit System

---

# Features

## Attendance System
- NFC attendance check-in
- Automatic timestamp recording
- User identification via NFC UID

## Credit System
- Store user credits in database
- Automatic deduction when borrowing materials
- Prevent borrowing if balance is insufficient

## Material Borrowing
- Borrow equipment/materials
- Transaction history logging
- Material inventory management

## Admin Features
- Register NFC cards
- Add/edit users
- Manage materials
- Track attendance records
- View borrowing history

---

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
