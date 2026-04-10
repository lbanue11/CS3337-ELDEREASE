import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css"; 
import LogoSymbol from "../assets/LogoSymbol.png";
import HouseIcon from "../assets/house_icon.png";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher"; 

// Original data array for non-translatable fields (link)
const housingResourcesData = [
  {
    link: "https://housing.lacounty.gov/press/articles/SeniorResources.html",
  },
  {
    link: "https://housing.lacity.gov/community-resources",
  },
  {
    link: "https://www.alaseniorliving.org/our-work/",
  },
  {
    link: "https://ad.lacounty.gov/services/homeless-support-services/",
  },
];

const Housing = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const resourceIndices = [0, 1, 2, 3];

  return (
    <>
      {/* ======== HEADER ========== */}
      <header className="header">
        {/* Mimic structure with header-left-group */}
        <div className="header-left-group"> {/* <--- Added this wrapper div */}
          <Link to="/home" className="nav-logo">
            {/* Consider using common.logoAlt key here too if consistent */}
            <img src={LogoSymbol} alt={t('hotlinesPage.header.logoAlt')} />
          </Link>
          <LanguageSwitcher /> {/* <--- Added the switcher */}
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
              <img src={HouseIcon} alt={t('housingPage.titleIconAlt')} className="section-icon" />
              {t('housingPage.pageTitle')}
            </h1>
          </div>
          <p className="housing-text">
            {t('housingPage.intro')}
          </p>

          <div className="housing-cards-container">
            {resourceIndices.map((index) => (
              <div className="housing-card" key={index}>
                <h2>{t(`housingPage.resources.${index}.name`)}</h2>
                <p className="card-location">{t(`housingPage.resources.${index}.location`)}</p>
                <p className="card-specialization">{t(`housingPage.resources.${index}.specialization`)}</p>
                <a
                  href={housingResourcesData[index]?.link}
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

export default Housing;