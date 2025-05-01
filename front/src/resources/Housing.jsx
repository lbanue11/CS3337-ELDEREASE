import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css"; // Assuming this CSS works for Housing too
import LogoSymbol from "../assets/LogoSymbol.png";
import HouseIcon from "../assets/house_icon.png";
import { useTranslation } from 'react-i18next'; // Import useTranslation

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
  const { t } = useTranslation(); // Get the t function
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  // Assume 4 resources based on JSON structure
  const resourceIndices = [0, 1, 2, 3];

  return (
    <>
      <header className="header">
        <Link to="/home" className="nav-logo">
          {/* Reusing the key from hotlinesPage assuming logo alt is consistent */}
          <img src={LogoSymbol} alt={t('hotlinesPage.header.logoAlt')} />
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {/* Reusing keys from navbar section */}
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
      </header>

      <main className="elder-main fade-in">
        {/* Using specific CSS classes might be better than reusing 'housing-*' if layouts differ */}
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
                {/* Reusing key from hotlinesPage assuming link text is consistent */}
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
    </>
  );
};

export default Housing;