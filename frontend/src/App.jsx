import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const ndefReaderRef = useRef(null);
  const timeoutRef = useRef(null);

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

        try {
          const uid = event.serialNumber;

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/attendance/check`,
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
    <div>
      <h1>Makerspace Attendance</h1>

      <button onClick={scanCard} disabled={isLoading}>
        {isLoading ? "Scanning... (30s timeout)" : "Scan NFC Card"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;