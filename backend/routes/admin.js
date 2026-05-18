const express = require("express");
const router = express.Router();
const { supabase } = require("../utils");

// GET all attendance records with optional filters
router.get("/records", async (req, res) => {
  try {
    const { date, user_id } = req.query;

    console.log("Admin /records endpoint called with filters:", { date, user_id });

    let query = supabase
      .from("attendance")
      .select(`
        id,
        user_id,
        created_at,
        users(id, name, uid)
      `)
      .order("created_at", { ascending: false });

    // Filter by date if provided
    if (date) {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;
      query = query
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay);
    }

    // Filter by user_id if provided
    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    const { data, error } = await query;

    console.log("Records query result:", { dataCount: data ? data.length : 0, error });

    if (error) {
      console.error("Records query error:", error);
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Records endpoint error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all users for dropdown
router.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, uid")
      .order("name", { ascending: true });

    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST manually add attendance (admin only)
router.post("/add-attendance", async (req, res) => {
  try {
    const { uid, password } = req.body;

    // Verify password
    if (password !== "1234") {
      return res.status(401).json({ message: "Invalid admin password" });
    }

    // Validation
    if (!uid || uid.trim() === "") {
      return res.status(400).json({ message: "UID is required" });
    }

    // Find user by UID
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid);

    if (userError) {
      return res.status(500).json({ message: "Database error", error: userError.message });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Record attendance
    const { error: attendanceError } = await supabase
      .from("attendance")
      .insert({
        user_id: user.id
      });

    if (attendanceError) {
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
