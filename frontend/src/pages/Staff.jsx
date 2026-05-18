import { useState, useRef, useEffect } from "react";
import axios from "axios";

function Staff() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const ndefReaderRef = useRef(null);
  const timeoutRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Auto-check attendance if UID is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidFromUrl = params.get("uid");

    if (uidFromUrl) {
      setIsLoading(true);
      checkAttendance(uidFromUrl);
    }
  }, []);

  const checkAttendance = async (uid) => {
    try {
      const response = await axios.post(
        `${apiUrl}/attendance/check`,
        { uid }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error checking attendance";
      setError(errorMsg);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Makerspace Attendance</h1>

      {/* Result Section */}
      <div style={{ marginTop: "40px", padding: "20px", border: "2px solid #ddd", borderRadius: "8px", textAlign: "center", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isLoading ? (
          <p style={{ fontSize: "16px", color: "#666" }}>Processing...</p>
        ) : message ? (
          <p style={{ padding: "15px", backgroundColor: "#D1F3D1", color: "#006600", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", width: "100%" }}>
            ✓ {message}
          </p>
        ) : error ? (
          <p style={{ padding: "15px", backgroundColor: "#FFD7D7", color: "#990000", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", width: "100%" }}>
            ✗ {error}
          </p>
        ) : (
          <p style={{ fontSize: "16px", color: "#999", fontStyle: "italic" }}>
            Scan your NFC card to check in
          </p>
        )}
      </div>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "20px", textAlign: "center", fontStyle: "italic" }}>
        💡 Scan your NFC card to record attendance
      </p>
    </div>
  );
}

export default Staff;
