import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";
import LogoSymbol from "./assets/LogoSymbol.png";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="header">
        <div className="home-logo">
          <img className="home-logo" src={LogoSymbol} alt="Logo" />
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/map" onClick={() => setMenuOpen(false)}>
            Map
          </Link>
          <a
            href="#helpful-resources"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Resources
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="home-intro-container fade-in">
        <h1 className="app-text-style">Welcome to Our Platform</h1>
        <p className="tagline-style">
          Helping you connect, navigate, and explore with ease.
        </p>

        <section className="resources-section">
          <h2 id="helpful-resources">Helpful Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>🏠 Housing Assistance</h3>
              <p>
                Find affordable senior housing options and emergency shelters.
              </p>
              <Link to="/housing">Explore</Link>
            </div>

            <div className="resource-card">
              <h3>🚗 Transportation Support</h3>
              <p>Learn about senior ride services and mobility aid programs.</p>
              <Link to="/transportation">Get Rides</Link>
            </div>

            <div className="resource-card">
              <h3>☎️ Hotlines & Safety</h3>
              <p>Contact elder abuse hotlines or mental health support.</p>
              <Link to="/hotlinesafety">See Hotlines</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
