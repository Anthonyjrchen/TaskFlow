import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* We'll add more routes here later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
