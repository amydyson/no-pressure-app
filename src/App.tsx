import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Medico from "./components/Medico";
import Patient from "./components/Patient";
import Home from "./components/Home"; // your current todos view

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medico" element={<Medico />} />
        <Route path="/patient" element={<Patient />} />
      </Routes>
    </Router>
  );
}

export default App;
