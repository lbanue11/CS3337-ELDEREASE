import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css"; 
import LogoSymbol from "../assets/LogoSymbol.png";
import HotlinesafetyIcon from "../assets/hotlinesafety_icon.png";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher";

// Original data array - We keep it for non-translatable fields like link and phone
const HotlinesafetyResourcesData = [
  {
    link: "https://ad.lacounty.gov/services/adult-protective-services/",
    phone: "1-877-4R-SENIORS (1-877-477-3646)",
  },
  {
    link: "https://aging.lacity.gov/",
    phone: "1-800-510-2020",
  },
  {
    link: "https://www.wiseandhealthyaging.org/elder-abuse-prevention",
    phone: "1-800-334-WISE (1-800-334-9473)",
  },
];

const Hotlinesafety = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const resourceIndices = [0, 1, 2];

  return (
    <>
      {/* ======== HEADER ========== */}
      <header className="header">
        {/* 2. Mimic Home.js structure: Wrap logo Link and Switcher in header-left-group */}
        <div className="header-left-group"> { }
          <Link to="/home" className="nav-logo">
            <img src={LogoSymbol} alt={t('hotlinesPage.header.logoAlt')} />
          </Link>
          <LanguageSwitcher /> {  }
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

      {/* ======== MAIN CONTENT ========== */}
      <main className="elder-main fade-in">
        <section className="housing-content">
          <div className="housing-header">
            <h1>
              <img
                src={HotlinesafetyIcon}
                alt={t('hotlinesPage.titleIconAlt')}
                className="section-icon"
              />
              {t('hotlinesPage.pageTitle')}
            </h1>
          </div>
          <p className="housing-text">
            {t('hotlinesPage.intro')}
          </p>

          <div className="housing-cards-container">
            {resourceIndices.map((index) => (
              <div className="housing-card" key={index}>
                <h2>{t(`hotlinesPage.resources.${index}.name`)}</h2>
                <p className="card-location">{t(`hotlinesPage.resources.${index}.location`)}</p>
                <p className="card-specialization">{t(`hotlinesPage.resources.${index}.specialization`)}</p>
                <p className="card-phone">{t('hotlinesPage.card.phonePrefix')}{HotlinesafetyResourcesData[index]?.phone}</p>
                <a
                  href={HotlinesafetyResourcesData[index]?.link}
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

export default Hotlinesafety;