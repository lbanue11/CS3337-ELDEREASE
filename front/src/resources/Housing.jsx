import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css";
import LogoSymbol from "../assets/LogoSymbol.png";
import HouseIcon from "../assets/house_icon.png";

const housingResources = [
  {
    name: "Los Angeles County Senior Housing Resources",
    location: "Los Angeles, CA",
    specialization:
      "The Los Angeles County Housing Resource Center website helps provide access to information and tools for finding senior housing and resources. Please continue to check this site for new information. Links to other important websites and agencies and housing locator tools are provided below.",
    link: "https://housing.lacounty.gov/press/articles/SeniorResources.html",
  },
  {
    name: "Housing Authority of the City of Los Angeles (HACLA)",
    location: "Los Angeles, CA",
    specialization:
      "HACLA offers a range of programs for low-income, homeless, disabled, children, and older adults. To apply for public housing or get updates on the Section 8 Waiting List, you can contact their main office or visit their website.",
    link: "https://housing.lacity.gov/community-resources",
  },
  {
    name: "Affordable Living for the Aging (ALA)",
    location: "Los Angeles, CA",
    specialization:
      "ALA provides several programs tailored for seniors: Shared Housing: Matches seniors to share housing, converting spare rooms into affordable living spaces. Permanent Supportive Housing: Offers housing with on-site social workers for seniors experiencing chronic homelessness.",
    link: "https://www.alaseniorliving.org/our-work/",
  },
  {
    name: "Los Angeles County Aging & Disabilities Department",
    location: "Los Angeles, CA",
    specialization:
      "This department provides a list of affordable housing options specific to older adults over 65 years of age, including the Section 8 Housing Choice Voucher Program and utility assistance for those needing help with utility bills.",
    link: "https://ad.lacounty.gov/services/homeless-support-services/",
  },
];

const Housing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="header">
        <Link to="/home" className="nav-logo">
          <img src={LogoSymbol} alt="ElderEase Logo" />
        </Link>

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

      <main className="elder-main fade-in">
        <section className="housing-content">
          <div className="housing-header">
            <h1>
              <img src={HouseIcon} alt="House Icon" className="section-icon" />
              Housing Assistance
            </h1>
          </div>
          <p className="housing-text">
            Here you can find affordable senior housing options and emergency
            shelters.
          </p>

          <div className="housing-cards-container">
            {housingResources.map((resource, index) => (
              <div className="housing-card" key={index}>
                <h2>{resource.name}</h2>
                <p className="card-location">{resource.location}</p>
                <p className="card-specialization">{resource.specialization}</p>
                <a
                  href={resource.link}
                  className="card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More Info →
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
