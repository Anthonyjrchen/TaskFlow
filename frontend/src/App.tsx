import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import SignupPage from "./pages/SignupPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - show tasks page (locked if not logged in) */}
        <Route path="/" element={<TasksPage />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Signup route (optional - you can add later) */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
