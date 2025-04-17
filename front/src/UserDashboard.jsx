import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";
import LogoSymbol from "./assets/LogoSymbol.png";
import email_icon from "./assets/email_icon.png";
import {Avatar} from "@mui/material";

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <>
            <div id="root">
            <header className="header">
                <div className="home-logo">
                    <img className="home-logo" src={LogoSymbol} alt="Logo"/>
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
        </div>


        <div className="full-bleed">

            <main>
                <aside className="sidebar-left">
                    <div className="location-card">
                        <h2> </h2>
                        <p>  </p>
                    </div>
                </aside>

                <section className="main-content">
                    <div className="info-card">
                        <h2></h2>
                        <p>  </p>
                    </div>
                </section>

                <aside className="sidebar-right">
                    <div className="user-card">
                        <Avatar sx={{ width: 80, height: 80, fontSize: 40 }}>B</Avatar>
                        <h2>BOB</h2>

                        <nav className={`nav ${menuOpen ? "open" : ""}`}>
                            <Link to="/EditProfile" onClick={() => setMenuOpen(false)}>
                                Edit Profile
                            </Link>
                        </nav>

                    </div>
                </aside>
            </main>

        </div>

        </>
    );
};

export default Home;
