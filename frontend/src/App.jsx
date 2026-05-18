import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
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
    console.log("API URL:", apiUrl); // DEBUG
    
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
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Makerspace Attendance</h1>

      {/* NFC Scan Section */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "16px", marginTop: 0 }}>Option 1: Scan NFC Card</h2>
        <button 
          onClick={scanCard} 
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? "Scanning... (30s timeout)" : "Scan NFC Card"}
        </button>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          Available on Android Chrome or compatible devices
        </p>
        <p style={{ fontSize: "11px", color: "#999", marginTop: "8px", fontStyle: "italic" }}>
          💡 Tip: Store this URL in your NFC cards: {window.location.origin}?uid=YOUR_UID
        </p>
      </div>

      {/* Manual UID Input Section */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "16px", marginTop: 0 }}>Option 2: Enter UID Manually</h2>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            placeholder="Enter NFC Card UID"
            value={manualUid}
            onChange={(e) => setManualUid(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "10px",
              boxSizing: "border-box"
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !manualUid.trim()}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              backgroundColor: "#34C759",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isLoading || !manualUid.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !manualUid.trim() ? 0.6 : 1,
              width: "100%"
            }}
          >
            Check Attendance
          </button>
        </form>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          Example UID: 04:A1:2B:3C
        </p>
      </div>

      {/* Results Section */}
      {message && (
        <p style={{ padding: "10px", backgroundColor: "#D1F3D1", color: "#006600", borderRadius: "5px", marginTop: "15px" }}>
          ✓ {message}
        </p>
      )}
      {error && (
        <p style={{ padding: "10px", backgroundColor: "#FFD7D7", color: "#990000", borderRadius: "5px", marginTop: "15px" }}>
          ✗ {error}
        </p>
      )}
    </div>
  );
}

export default App;