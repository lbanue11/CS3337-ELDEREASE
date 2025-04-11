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

      <main className="home-intro-container">
        <h1 className="app-text-style">Welcome to Our Platform</h1>
        <p className="tagline-style">
          Helping you connect, navigate, and explore with ease.
        </p>
      </main>
    </>
  );
};

export default Home;
