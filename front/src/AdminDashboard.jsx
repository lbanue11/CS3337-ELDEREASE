import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoSymbol from "./assets/LogoSymbol.png";
import "./AdminDashboard.css";

// Enable sending cookies with every request
axios.defaults.withCredentials = true;

export default function AdminDashboard() {
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch current profile and verify admin role
    useEffect(() => {
        axios.get("/api/profile")
            .then(({ data }) => {
                if (data.role !== "ADMIN") {
                    navigate("/home");
                } else {
                    setProfile(data);
                }
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    console.error("Failed to load profile:", err);
                }
            });
    }, [navigate]);

    // Fetch all users once profile is confirmed
    useEffect(() => {
        if (!profile) return;
        console.log("→ About to fetch users…");
        axios.get("/api/admin/users")
            .then(({ data }) => {
                console.log("← /api/admin/users response:", data);
                setUsers(data);
            })
            .catch(err => console.error("Failed to load users:", err));
    }, [profile]);

    const editUser = (user) => {

    }



    const handleLogout = () => {
        axios.post("/api/auth/logout")
            .finally(() => navigate("/login"));
    };

    if (!profile) {
        return <div>Loading your profile…</div>;
    }

    return (
        <>
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

            <main>
                <h1>All Users</h1>
                <div className="user-table">
                    <table>
                        <thead>
                        <tr>
                            <th>userId</th>
                            <th>firstName</th>
                            <th>lastName</th>
                            <th>email</th>
                            <th>password</th>
                            <th>role</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit">Edit</button>
                                    <button className="delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}
