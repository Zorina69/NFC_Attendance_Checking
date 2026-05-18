import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Staff from "./pages/Staff";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Staff />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;