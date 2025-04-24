import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css";
import LogoSymbol from "../assets/LogoSymbol.png";
import TransportationIcon from "../assets/transportation_icon.png";

const transportationResources = [
  {
    name: "County of Los Angeles Transportation and mobile services",
    location: "Los Angeles, CA",
    specialization:
      "To actively support a more age-friendly Los Angeles County, these transportation and mobility services are dedicated to older and dependent adults.",
    link: "https://lacounty.gov/residents/older-adults/transportation-and-mobile-services/",
  },
  {
    name: "City of Los Angeles Department of Aging Transportation ",
    location: "Los Angeles, CA",
    specialization:
      "The City of Los Angeles offers low-cost and accessible transportation services for seniors, including door-to-door rides, paratransit, and the CityRide program to help with errands, appointments, and more.",
    link: "https://aging.lacity.gov/transportation-services",
  },
];

const Transportation = () => {
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
              <img
                src={TransportationIcon}
                alt="Transportation Icon"
                className="section-icon"
              />
              Transportation Support
            </h1>
          </div>
          <p className="housing-text">
            Explore trusted programs that offer safe and affordable rides for
            seniors and individuals with limited mobility.
          </p>

          <div className="housing-cards-container">
            {transportationResources.map((resource, index) => (
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

export default Transportation;
