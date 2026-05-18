const supabase = require("./db");

/**
 * Query helper for Supabase (already async)
 */
const query = {
  select: (table, filters = {}) => supabase.from(table).select("*").match(filters),
  selectAll: (table) => supabase.from(table).select("*"),
  insert: (table, data) => supabase.from(table).insert(data),
  update: (table, data, filters) => supabase.from(table).update(data).match(filters),
  delete: (table, filters) => supabase.from(table).delete().match(filters)
};

module.exports = {
  query,
  supabase
};
