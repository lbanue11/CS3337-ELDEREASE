import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoSymbol from "./assets/LogoSymbol.png";
import "./AdminDashboard.css";

axios.defaults.withCredentials = true;

export default function AdminDashboard() {
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const navigate = useNavigate();

    const handleEditClick = (user) => {
        setEditingUserId(user.userId);
        setEditedUser({ ...user });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelClick = () => {
        setEditingUserId(null);
        setEditedUser({});
    };

    // Save edits
    const handleSaveClick = async () => {
        try {
            const { data } = await axios.put(
                `/api/admin/users/${editingUserId}`,
                editedUser
            );
            const updated = { ...data, userId: data.userId ?? data.id };
            setUsers((list) =>
                list.map((u) => (u.userId === editingUserId ? updated : u))
            );
            setEditingUserId(null);
            setEditedUser({});
        } catch (err) {
            console.error("Failed to save user:", err);
            alert("Couldn’t save changes—check console for details.");
        }
    };

    // Delete a user and all their favorites
    const handleDeleteClick = async (userId) => {
        if (!window.confirm("Really delete this user and all their favorites?")) return;
        try {
            await axios.delete(`/api/google-favorites/user/${userId}`);

            await axios.delete(`/api/admin/users/${userId}`);

            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (err) {
            console.error("Error deleting user and favorites:", err.response || err);
            alert("Delete failed: " + (err.response?.data || err.message));
        }
    };

    // Fetch current profile and verify admin role
    useEffect(() => {
        axios
            .get("/api/profile")
            .then(({ data }) => {
                if (data.role !== "ADMIN") {
                    navigate("/home");
                } else {
                    setProfile(data);
                }
            })
            .catch((err) => {
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
        axios
            .get("/api/admin/users")
            .then(({ data }) => {
                const list = data.map((u) => ({ ...u, userId: u.userId ?? u.id }));
                setUsers(list);
            })
            .catch((err) => console.error("Failed to load users:", err));
    }, [profile]);

    const handleLogout = () => {
        axios.post("/api/auth/logout").finally(() => navigate("/login"));
    };

    if (!profile) {
        return <div>Loading your profile…</div>;
    }

    return (
        <>
            <header className="header">
                <div className="home-logo">
                    <img className="home-logo" src={LogoSymbol} alt="Logo" />
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
                        {users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <input
                                            name="firstName"
                                            value={editedUser.firstName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.firstName
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <input
                                            name="lastName"
                                            value={editedUser.lastName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.lastName
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <input
                                            name="email"
                                            value={editedUser.email}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <input
                                            name="password"
                                            type="text"
                                            value={editedUser.password || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.password
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <select
                                            name="role"
                                            value={editedUser.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.userId ? (
                                        <>
                                            <button className="save" onClick={handleSaveClick}>Save</button>
                                            <button className="cancel" onClick={handleCancelClick}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="edit"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete"
                                                onClick={() => handleDeleteClick(user.userId)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
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
