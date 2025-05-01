import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";
import LogoSymbol from "./assets/LogoSymbol.png";
import axios from "axios";
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("/api/auth/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        navigate("/login");
      });
  };

  return (
    <>
      <header className="header">
        <div className="header-left-group">
          <div className="home-logo">
            <img className="home-logo" src={LogoSymbol} alt={t('common.logoAlt')} />
          </div>
          <LanguageSwitcher /> {/* LanguageSwitcher component is included */}
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/userdashboard" onClick={() => setMenuOpen(false)}>
            {t('navbar.dashboard')}
          </Link>
          <Link to="/map" onClick={() => setMenuOpen(false)}>
            {t('navbar.map')}
          </Link>
          <a
            href="#helpful-resources"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            {t('navbar.resources')}
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            {t('navbar.logout')}
          </button>
        </nav>
      </header>

      <main className="home-intro-container fade-in">
        <h1 className="app-text-style">{t('home.welcome')}</h1>
        <p className="tagline-style">
          {t('home.tagline')}
        </p>

        <section className="resources-section">
          <h2 id="helpful-resources">{t('home.helpfulResources')}</h2>
          <div className="resources-grid">
            {/* Resource Card 1 */}
            <div className="resource-card">
              <h3>{t('home.resources.housing.title')}</h3>
              <p>{t('home.resources.housing.description')}</p>
              <Link to="/housing">{t('home.resources.housing.link')}</Link>
            </div>

            {/* Resource Card 2 */}
            <div className="resource-card">
              <h3>{t('home.resources.transportation.title')}</h3>
              <p>{t('home.resources.transportation.description')}</p>
              <Link to="/transportation">{t('home.resources.transportation.link')}</Link>
            </div>

            {/* Resource Card 3 */}
            <div className="resource-card">
              <h3>{t('home.resources.hotlines.title')}</h3>
              <p>{t('home.resources.hotlines.description')}</p>
              <Link to="/hotlinesafety">{t('home.resources.hotlines.link')}</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;