
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import SignupPage from "./pages/SignupPage";
function App() {

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
