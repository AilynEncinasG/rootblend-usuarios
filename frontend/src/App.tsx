import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center" }}>
        <h1>RootBlend Usuarios</h1>
        <nav style={{ marginBottom: "2rem" }}>
          <Link to="/login" style={{ margin: "0 1rem" }}>Login</Link>
          <Link to="/register" style={{ margin: "0 1rem" }}>Register</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;