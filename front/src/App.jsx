import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Registration from "./Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom"; // we using routers to switch pages
import LogoSymbol from "./assets/LogoSymbol.png";
import MapComponent from "./MapComponent.jsx";
import Home from "./Home";

function App() {
  const [count, setCount] = useState(0); // Keeping count state as requested

  return (
    <Router>
      <Routes>
        {/* Root Route ("/") */}
        <Route
          path="/"
          element={
            <div
              style={{
                textAlign: "center",
                paddingTop: "2rem",
                paddingBottom: "2rem",
              }}
            >
              <img className="logo" src={LogoSymbol} alt="Logo" />
              <h1 className="app-text-style">Welcome to ElderEase</h1>
              {/* Tagline using Title Case */}
              <p className="tagline-style">
                Your Guide to Nearby Senior Care Centers
              </p>
              <Link to="/login" className="button-primary">
                Go to Login
              </Link>
              <br />
            </div>
          }
        />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Registration Route */}
        <Route path="/register" element={<Registration />} />

        {/* Map Route */}
        <Route path="/map" element={<MapComponent />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
