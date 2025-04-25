import React, {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";
import LogoSymbol from "./assets/LogoSymbol.png";
import email_icon from "./assets/email_icon.png";
import {Avatar} from "@mui/material";
import axios from "axios";

const UserDashboard = () => {
    const [menuOpen, setMenuOpen]   = useState(false);
    const [profile, setProfile]     = useState(null);
    const navigate                   = useNavigate();

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
                navigate("/login");
            });
    };


    // While loading
    if (!profile) {
        return <div>Loading your profile…</div>;
    }





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
                        <Link to="/home" onClick={() => setMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/map" onClick={() => setMenuOpen(false)}>
                            Map
                        </Link>
                        <a
                            href="/home#helpful-resources"
                            onClick={() => setMenuOpen(false)}
                            className="nav-link"
                        >
                            Resources
                        </a>
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
                            <Avatar sx={{ width: 80, height: 80, fontSize: 40 }}>{profile.firstName.charAt(0)}</Avatar>
                            <h2>{profile.firstName} {profile.lastName}</h2>

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

export default UserDashboard;
