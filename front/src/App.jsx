import axios from "axios";
import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Registration from "./Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom"; // we using routers to switch pages
import LogoSymbol from "./assets/LogoSymbol.png";
import MapComponent from "./MapComponent.jsx";
import Home from "./Home";
import UserDashboard from "./UserDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Housing from "./resources/Housing";
import Transportation from "./resources/Transportation";
import Hotlinesafety from "./resources/Hotlinesafety";
import CaregiverSignup from "./CaregiverSignup.jsx";
import CaregiverDashboard from "./CaregiverDashboard.jsx";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

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

          <Route path="/signup/caregiver" element={<CaregiverSignup />} />

          <Route path="/caregiverdashboard" element={<CaregiverDashboard />} />

        {/* Map Route */}
        <Route path="/map" element={<MapComponent />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* User Dashboard*/}
        <Route path="/userdashboard" element={<UserDashboard />} />

          {/* Admin Dashboard*/}
          <Route path="/admin" element={<AdminDashboard />} />

        {/*Resources - Housing*/}
        <Route path="/housing" element={<Housing />} />
        {/*Resources - Transportation*/}
        <Route path="/transportation" element={<Transportation />} />
        {/*Resources - Transportation*/}
        <Route path="/hotlinesafety" element={<Hotlinesafety />} />
      </Routes>
    </Router>
  );
}

export default App;
