const express = require("express");
const cors = require("cors");

const attendanceRoutes = require("./routes/attendance");
const borrowRoutes = require("./routes/borrow");
const userRoutes = require("./routes/users");

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/attendance", attendanceRoutes);
app.use("/borrow", borrowRoutes);
app.use("/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});