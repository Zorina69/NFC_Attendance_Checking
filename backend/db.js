const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test connection
supabase.from("users").select("count", { count: "exact" })
  .then(() => {
    console.log("Supabase connected");
  })
  .catch((err) => {
    console.log("Supabase connection error:", err.message);
  });

module.exports = supabase;