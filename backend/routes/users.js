const express = require("express");
const router = express.Router();
const { supabase } = require("../utils");

router.post("/register", async (req, res) => {
  try {
    const { name, uid, credit } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!uid || uid.trim() === "") {
      return res.status(400).json({ message: "UID is required" });
    }
    if (credit === undefined || credit === null) {
      return res.status(400).json({ message: "Credit is required" });
    }
    if (typeof credit !== "number" || credit < 0) {
      return res.status(400).json({ message: "Credit must be a positive number" });
    }

    // Check if UID already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid);

    if (checkError) {
      return res.status(500).json({ message: "Database error", error: checkError.message });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ message: "UID already registered" });
    }

    // Register new user
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        name,
        uid,
        credit
      });

    if (insertError) {
      return res.status(500).json({ message: "Registration failed", error: insertError.message });
    }

    return res.json({
      message: "User registered"
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

module.exports = router;