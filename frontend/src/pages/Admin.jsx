import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [manualUid, setManualUid] = useState("");
  const [addMessage, setAddMessage] = useState("");
  const [addError, setAddError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setIsLoggedIn(true);
      setPasswordError("");
      setPassword("");
      loadData();
    } else {
      setPasswordError("Invalid password");
      setPassword("");
    }
  };

  // Load attendance records and users
  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Loading admin data from:", apiUrl);
      
      // Load users
      const usersRes = await axios.get(`${apiUrl}/admin/users`);
      console.log("Users loaded:", usersRes.data);
      setUsers(usersRes.data);

      // Load attendance records
      const recordsRes = await axios.get(`${apiUrl}/admin/records`);
      console.log("Records loaded:", recordsRes.data);
      setRecords(recordsRes.data);
    } catch (err) {
      console.error("Load data error:", err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const handleFilter = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}/admin/records?`;
      if (filterDate) url += `date=${filterDate}&`;
      if (filterUserId) url += `user_id=${filterUserId}&`;
      
      const res = await axios.get(url);
      setRecords(res.data);
      setMessage("");
      setError("");
    } catch (err) {
      setError("Failed to filter records");
    } finally {
      setLoading(false);
    }
  };

  // Add attendance manually
  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!manualUid.trim()) {
      setAddError("Please enter a UID");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/admin/add-attendance`, {
        uid: manualUid,
        password: "1234"
      });
      setAddMessage(`✓ Attendance recorded for ${res.data.user.name}`);
      setManualUid("");
      setAddError("");
      
      // Reload records after 1 second
      setTimeout(loadData, 1000);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to record attendance");
      setAddMessage("");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "16px", boxSizing: "border-box" }}
            />
          </div>
          {passwordError && <p style={{ color: "red", marginBottom: "10px" }}>{passwordError}</p>}
          <button type="submit" style={{ width: "100%", padding: "10px", fontSize: "16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <button onClick={() => setIsLoggedIn(false)} style={{ float: "right", padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Logout
      </button>
      <h1>Admin Dashboard</h1>

      {/* Add Attendance Section */}
      <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add Attendance</h3>
        <form onSubmit={handleAddAttendance} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter UID"
            value={manualUid}
            onChange={(e) => setManualUid(e.target.value)}
            style={{ flex: 1, padding: "8px", fontSize: "14px" }}
          />
          <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Add
          </button>
        </form>
        {addMessage && <p style={{ color: "green", marginTop: "10px" }}>{addMessage}</p>}
        {addError && <p style={{ color: "red", marginTop: "10px" }}>{addError}</p>}
      </div>

      {/* Filter Section */}
      <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Filter Records</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div>
            <label>Date: </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ padding: "8px" }}
            />
          </div>
          <div>
            <label>User: </label>
            <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} style={{ padding: "8px" }}>
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.uid})
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleFilter} style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Filter
          </button>
          <button onClick={() => { setFilterDate(""); setFilterUserId(""); loadData(); }} style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Clear
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div>
        <h3>Attendance Records ({records.length})</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        
        {records.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>User</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>UID</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "10px" }}>{record.users?.name || "N/A"}</td>
                  <td style={{ padding: "10px", fontSize: "12px", fontFamily: "monospace" }}>{record.users?.uid || "N/A"}</td>
                  <td style={{ padding: "10px" }}>{new Date(record.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
