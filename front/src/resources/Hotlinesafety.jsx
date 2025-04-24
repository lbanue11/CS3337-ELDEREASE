import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./resources.css";
import LogoSymbol from "../assets/LogoSymbol.png";
import HotlinesafetyIcon from "../assets/hotlinesafety_icon.png";

const HotlinesafetyResources = [
  {
    name: "Los Angeles County Adult Protective Services (APS)",
    location: "Los Angeles, CA",
    specialization:
      "Provides 24/7 support for older and dependent adults who may be victims of abuse, neglect, or exploitation. APS investigates reports and offers protective services to ensure the safety and well-being of vulnerable adults.",
    link: "https://ad.lacounty.gov/services/adult-protective-services/",
    phone: "1-877-4R-SENIORS (1-877-477-3646)",
  },
  {
    name: "City of Los Angeles Department of Aging – Information & Assistance",
    location: "Los Angeles, CA",
    specialization:
      "Offers information and referrals for seniors on various services, including transportation, nutrition, caregiver support, and more. This hotline connects older adults and their caregivers to resources that promote independent living.",
    link: "https://aging.lacity.gov/",
    phone: "1-800-510-2020",
  },
  {
    name: "Long-Term Care Ombudsman Program – WISE & Healthy Aging",
    location: "Los Angeles, CA",
    specialization:
      "Advocates for residents in long-term care facilities, addressing concerns related to quality of care, residents' rights, and abuse or neglect. The program works to resolve complaints and improve the quality of life for seniors in care facilities.",
    link: "https://www.wiseandhealthyaging.org/elder-abuse-prevention",
    phone: "1-800-334-WISE (1-800-334-9473)",
  },
];

const Hotlinesafety = () => {
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
                src={HotlinesafetyIcon}
                alt="Hotlinesafety Icon"
                className="section-icon"
              />
              Hotlines & Safety
            </h1>
          </div>
          <p className="housing-text">
            Trusted hotlines and safety resources for seniors — help is just a
            call away.
          </p>

          <div className="housing-cards-container">
            {HotlinesafetyResources.map((resource, index) => (
              <div className="housing-card" key={index}>
                <h2>{resource.name}</h2>
                <p className="card-location">{resource.location}</p>
                <p className="card-specialization">{resource.specialization}</p>
                <p className="card-phone">📞 {resource.phone}</p>
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

export default Hotlinesafety;
