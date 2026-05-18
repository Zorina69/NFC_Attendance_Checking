const express = require("express");
const router = express.Router();
const { supabase } = require("../utils");

router.post("/check", async (req, res) => {
  try {
    const { uid } = req.body;

    console.log("=== ATTENDANCE CHECK ===");
    console.log("Received UID:", uid);
    console.log("UID type:", typeof uid);
    console.log("UID length:", uid ? uid.length : "null");

    // Validation
    if (!uid || uid.trim() === "") {
      return res.status(400).json({ message: "UID is required" });
    }

    // Check if user exists - also try selecting all to debug
    console.log("Querying database for UID:", uid);
    
    // First, try to get ALL users to see if table is accessible
    const { data: allUsers, error: allError } = await supabase
      .from("users")
      .select("*");
    
    console.log("All users query - Count:", allUsers ? allUsers.length : 0);
    console.log("All users query - Error:", allError);
    
    // Now query for specific UID
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid);
    
    console.log("Query result - Users found:", users ? users.length : 0);
    console.log("Query result - Data:", JSON.stringify(users));
    console.log("Query error:", userError);

    if (userError) {
      return res.status(500).json({ message: "Database error", error: userError.message });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    // Record attendance
    console.log("Attempting to insert attendance for user_id:", user.id);
    const { error: attendanceError } = await supabase
      .from("attendance")
      .insert({
        user_id: user.id
      });

    console.log("Insert result - Error:", attendanceError);
    
    if (attendanceError) {
      console.log("Attendance insert failed:", JSON.stringify(attendanceError));
      return res.status(500).json({ message: "Failed to record attendance", error: attendanceError.message });
    }

    return res.json({
      message: "Attendance recorded",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;