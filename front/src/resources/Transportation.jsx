import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css"; // Assuming shared CSS
import LogoSymbol from "../assets/LogoSymbol.png";
import TransportationIcon from "../assets/transportation_icon.png";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher";

// Original data array for non-translatable fields (link)
const transportationResourcesData = [
  {
    link: "https://lacounty.gov/residents/older-adults/transportation-and-mobile-services/",
  },
  {
    link: "https://aging.lacity.gov/transportation-services",
  },
];

const Transportation = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const resourceIndices = [0, 1];

  return (
    <>
      {/* ======== HEADER ========== */}
      <header className="header">
        {}
        <div className="header-left-group">
          <Link to="/home" className="nav-logo">
            <img src={LogoSymbol} alt={t('hotlinesPage.header.logoAlt')} />
          </Link>
          <LanguageSwitcher /> {}
        </div>

        {/* --- Keep other header elements unchanged --- */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/map" onClick={() => setMenuOpen(false)}>
            {t('navbar.map')}
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            {t('navbar.logout')}
          </button>
        </nav>
        {/* --- End of unchanged elements --- */}
      </header>
      {/* ======== END HEADER ========== */}

      {/* ======== MAIN CONTENT (Unchanged) ========== */}
      <main className="elder-main fade-in">
        <section className="housing-content">
          <div className="housing-header">
            <h1>
              <img
                src={TransportationIcon}
                alt={t('transportationPage.titleIconAlt')}
                className="section-icon"
              />
              {t('transportationPage.pageTitle')}
            </h1>
          </div>
          <p className="housing-text">
            {t('transportationPage.intro')}
          </p>

          <div className="housing-cards-container">
            {resourceIndices.map((index) => (
              <div className="housing-card" key={index}>
                <h2>{t(`transportationPage.resources.${index}.name`)}</h2>
                <p className="card-location">{t(`transportationPage.resources.${index}.location`)}</p>
                <p className="card-specialization">{t(`transportationPage.resources.${index}.specialization`)}</p>
                <a
                  href={transportationResourcesData[index]?.link}
                  className="card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('hotlinesPage.card.moreInfoLink')}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* ======== END MAIN CONTENT ========== */}
    </>
  );
};

export default Transportation;