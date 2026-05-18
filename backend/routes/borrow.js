const express = require("express");
const router = express.Router();
const { supabase } = require("../utils");

router.post("/material", async (req, res) => {
  try {
    const { uid, materialId } = req.body;

    // Validation
    if (!uid || uid.trim() === "") {
      return res.status(400).json({ message: "UID is required" });
    }
    if (!materialId || materialId === "") {
      return res.status(400).json({ message: "Material ID is required" });
    }

    // Get user by UID
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid);

    if (userError) {
      return res.status(500).json({ message: "Database error", error: userError.message });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    // Get material details
    const { data: materials, error: materialError } = await supabase
      .from("materials")
      .select("*")
      .eq("id", materialId);

    if (materialError) {
      return res.status(500).json({ message: "Database error", error: materialError.message });
    }

    if (!materials || materials.length === 0) {
      return res.status(404).json({ message: "Material not found" });
    }

    const material = materials[0];

    // Check if user has enough credit
    if (user.credit < material.credit_cost) {
      return res.status(400).json({
        message: "Not enough credit"
      });
    }

    const newCredit = user.credit - material.credit_cost;

    // Update user credit
    const { error: updateError } = await supabase
      .from("users")
      .update({ credit: newCredit })
      .eq("id", user.id);

    if (updateError) {
      return res.status(500).json({ message: "Failed to update credit", error: updateError.message });
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from("borrow_transactions")
      .insert({
        user_id: user.id,
        material_id: material.id,
        credit_used: material.credit_cost
      });

    if (transactionError) {
      return res.status(500).json({ message: "Failed to record transaction", error: transactionError.message });
    }

    return res.json({
      message: "Borrow successful",
      remainingCredit: newCredit
    });
  } catch (error) {
    return res.status(500).json({ message: "Borrow failed", error: error.message });
  }
});

module.exports = router;