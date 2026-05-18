const express = require("express");
const cors = require("cors");
const path = require("path");

// Resolve routes relative to this file's location
const attendanceRoutes = require(path.join(__dirname, "./routes/attendance"));
const borrowRoutes = require(path.join(__dirname, "./routes/borrow"));
const userRoutes = require(path.join(__dirname, "./routes/users"));

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://nfc-attendance-checking.vercel.app"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

console.log("Routes loaded successfully");
console.log("Mounting /attendance routes");
console.log("Mounting /borrow routes");
console.log("Mounting /users routes");

app.use("/attendance", attendanceRoutes);
app.use("/borrow", borrowRoutes);
app.use("/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});