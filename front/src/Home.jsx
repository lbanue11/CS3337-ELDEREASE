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
    <header className="header">
      <div className="logo">
        <img className="logo" src={LogoSymbol} alr="Logo" />
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
  );
};

export default Home;
