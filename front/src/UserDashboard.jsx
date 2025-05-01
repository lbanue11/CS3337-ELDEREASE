import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";
import LogoSymbol from "./assets/LogoSymbol.png";
import { Avatar } from "@mui/material";
import axios from "axios";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import LanguageSwitcher from './components/LanguageSwitcher'; // Import LanguageSwitcher for consistency

const UserDashboard = () => {
    const { t } = useTranslation(); // Initialize useTranslation
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Fetch profile on mount
    useEffect(() => {
        axios
            .get("/api/profile")
            .then(res => setProfile(res.data))
            .catch(err => {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    console.error("Failed to load profile:", err);
                    // Consider adding a user-facing error message here
                }
            });
    }, [navigate]);

    const handleLogout = () => {
        axios
            .post("/api/auth/logout")
            .then(() => {
                navigate("/login");
            })
            .catch(err => {
                console.error("Logout failed:", err);
                // Optionally navigate to login even on error
                navigate("/login");
            });
    };

    // While loading
    if (!profile) {
        // Use t() for loading message
        return <div>{t('dashboard.loading', 'Loading your profile…')}</div>;
    }

    return (
        <>
            {/* Use standard header structure like in Home.js */}
            <header className="header">
                <div className="header-left-group"> {/* Group logo and switcher */}
                    <Link to="/home" className="nav-logo"> {/* Link logo to home */}
                        <img src={LogoSymbol} alt={t('common.logoAlt', 'Logo')} />
                    </Link>
                    <LanguageSwitcher /> {/* Add language switcher */}
                </div>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>

                <nav className={`nav ${menuOpen ? "open" : ""}`}>
                    {/* "Home" link removed as logo links to home */}
                    <Link to="/map" onClick={() => setMenuOpen(false)}>
                        {t('navbar.map', 'Map')}
                    </Link>
                    <a
                        href="/home#helpful-resources" // This scrolls to the section on the home page
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            navigate('/home'); // Navigate to home first
                            // Wait a moment for navigation, then scroll
                            setTimeout(() => {
                                const el = document.getElementById('helpful-resources');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100); // Adjust timeout if needed
                            setMenuOpen(false);
                        }}
                        className="nav-link"
                    >
                        {t('navbar.resources', 'Resources')}
                    </a>
                    {/* Dashboard link (currently active page, styled differently) */}
                    <Link to="/userdashboard" onClick={() => setMenuOpen(false)} style={{ pointerEvents: 'none', opacity: 0.6 }}>
                         {t('navbar.dashboard', 'Dashboard')}
                    </Link>
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                        }}
                    >
                        {t('navbar.logout', 'Logout')}
                    </button>
                </nav>
            </header>


            <div className="full-bleed">
                <main className="dashboard-main">
                    <aside className="sidebar-left">
                        <div className="location-card">
                            <h2> </h2>
                            <p> </p>
                        </div>
                    </aside>

                    <section className="main-content">
                        <div className="info-card">
                            <h2></h2>
                            <p> </p>
                        </div>
                    </section>

                    <aside className="sidebar-right">
                        <div className="user-card">
                            <Avatar sx={{ width: 80, height: 80, fontSize: 40 }}>
                                {profile.firstName?.charAt(0) || '?'}
                            </Avatar>
                            <h2>{profile.firstName} {profile.lastName}</h2>
                            <div>
                                <Link to="/EditProfile" onClick={() => setMenuOpen(false)}>
                                    {t('dashboard.editProfile', 'Edit Profile')}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
};

export default UserDashboard;