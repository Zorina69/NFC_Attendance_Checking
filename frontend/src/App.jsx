import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Admin from "./Admin";

function App() {
  const [page, setPage] = useState("staff");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualUid, setManualUid] = useState("");
  const ndefReaderRef = useRef(null);
  const timeoutRef = useRef(null);

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
    const apiUrl = import.meta.env.VITE_API_URL;
    
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

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!manualUid.trim()) {
      setError("Please enter a UID");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    await checkAttendance(manualUid);
    setManualUid("");
  };

  const scanCard = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Check if NFC is supported
      if (!("NDEFReader" in window)) {
        setError("NFC is not supported on this device");
        setIsLoading(false);
        return;
      }

      const ndef = new NDEFReader();
      ndefReaderRef.current = ndef;

      await ndef.scan();

      setMessage("Waiting for NFC card...");

      // Set 30-second timeout
      timeoutRef.current = setTimeout(() => {
        ndef.abort();
        setError("Scan timeout - no card detected. Please try again.");
        setMessage("");
        setIsLoading(false);
      }, 30000);

      ndef.onreading = async (event) => {
        // Clear timeout since we got a reading
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const uid = event.serialNumber;
        await checkAttendance(uid);
      };

      ndef.onreadingerror = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setError("Error reading NFC card. Please try again.");
        setMessage("");
        setIsLoading(false);
      };
    } catch (error) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);
      const errorMsg =
        error.name === "NotAllowedError"
          ? "NFC permission denied"
          : error.name === "NotSupportedError"
          ? "NFC not supported on this device"
          : error.name === "AbortError"
          ? "Scan cancelled"
          : error.message || "Error scanning NFC";
      setError(errorMsg);
      setMessage("");
    }
  };

  return (
    <>
      {/* Navigation */}
      <div style={{ backgroundColor: "#f8f9fa", padding: "10px 20px", borderBottom: "1px solid #dee2e6", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button 
          onClick={() => setPage("staff")}
          style={{
            padding: "8px 16px",
            backgroundColor: page === "staff" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Staff
        </button>
        <button 
          onClick={() => setPage("admin")}
          style={{
            padding: "8px 16px",
            backgroundColor: page === "admin" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Admin
        </button>
      </div>

      {/* Page Content */}
      {page === "staff" ? (
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
      ) : (
        <Admin />
      )}
    </>
  );
}

export default App;