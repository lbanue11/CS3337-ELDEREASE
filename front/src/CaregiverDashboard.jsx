import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import LogoSymbol from "./assets/LogoSymbol.png";
import {
    Avatar, Card, CardContent, CardActions, Button, Typography, List,
    ListItem, ListItemIcon, ListItemText, CircularProgress, Box, Divider,
    TextField, DialogTitle, Dialog, DialogContent, DialogActions
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import "./CaregiverDashboard.css"
// import CakeIcon from '@mui/icons-material/Cake';

import axios from "axios";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

// Helper Function to Format Phone Number
const formatPhoneNumber = (value) => {
    if (!value) return null;
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null; // Return null if format doesn't match
};


const CaregiverDashboard = () => {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const [openAddElder, setOpenAddElder] = useState(false);
    const [elderId, setElderId] = useState("");
    const [elderEmail, setElderEmail] = useState("");
    const [elders, setElders] = useState([]);
    const [loadingElders, setLoadingElders] = useState(true);
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [currentElder, setCurrentElder] = useState(null);

    // links elder to cargiver
    const handleLinkElder = async () => {
        try {
            await axios.post("/api/caregiver/elders", { elderId: Number(elderId) });
            setOpenAddElder(false);
            setElderId("");
            setElderEmail("");
            fetchElders(); // re‑load the list
        } catch (e) {
            alert("Failed to add elder.");
        }
    };

    const handleOpenMessage = elder => {
        setCurrentElder(elder);
        setMessageText("");
        setOpenMessageDialog(true);
    };

    const handleSendMessage = async () => {
        try {
            await axios.post("/api/caregiver/messages", {
                elderId: currentElder.userId,
                message: messageText
            });
            setOpenMessageDialog(false);
            // optionally show a toast/snackbar
        } catch (e) {
            alert("Failed to send message.");
        }
    };

    // gets elder data
    const fetchElders = useCallback(() => {
        setLoadingElders(true);
        axios.get("/api/caregiver/elders")
            .then(res => setElders(res.data || []))
            .catch(() => setElders([]))
            .finally(() => setLoadingElders(false));
    }, []);

    const fetchProfile = useCallback(() => {
        axios.get("/api/profile")
            .then(res => {
                setProfile(res.data);
                setEditedProfile(res.data);
            })
            .catch(err => {
                if (err.response?.status === 401) { navigate("/login"); }
                else { console.error("Failed to load profile:", err); }
            });
    }, [navigate]);


    const fetchFavorites = useCallback(() => {
        setLoadingFavorites(true);
        axios.get("/api/google-favorites/user")
            .then(res => {
                console.log("Fetched Favorites:", res.data);
                setFavorites(res.data || []);
                setLoadingFavorites(false);
            })
            .catch(err => {
                console.error("Failed to load favorites:", err);
                if (err.response?.status === 401) {
                    console.error("Unauthorized to fetch favorites.");
                }
                setFavorites([]);
                setLoadingFavorites(false);
            });
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchFavorites();
        fetchElders();
    }, [fetchProfile, fetchFavorites, fetchElders]);

    const handleLogout = () => {
        axios.post("/api/auth/logout")
            .then(() => navigate("/login"))
            .catch(err => { console.error("Logout failed:", err); navigate("/login"); });
    };

    const handleEditToggle = () => {
        if (!isEditing) { setEditedProfile({ ...profile }); }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setEditedProfile({ ...profile });
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProfile(prev => ({ ...prev, [name]: value === '' ? null : value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        const profileToSave = { ...editedProfile };
        // Clean phone number before saving
        if (profileToSave.phone) {
            profileToSave.phone = ('' + profileToSave.phone).replace(/\D/g, '');
        }
        console.log("Saving cleaned profile data:", profileToSave);
        axios.put("/api/profile", profileToSave)
            .then(res => {
                setProfile(res.data);
                setEditedProfile(res.data);
                setIsEditing(false);
                console.log("Profile updated successfully with data:", res.data);
            })
            .catch(err => {
                console.error("Failed to save profile:", err);
                alert(`Error saving profile: ${err.response?.data?.message || err.response?.data || err.message}`);
            })
            .finally(() => { setIsSaving(false); });
    };


    // --- Helper Functions ---
    // formatAddress definition (only once)
    const formatAddress = (p) => {
        if (!p) return null;
        const parts = [p.street, p.city, p.state, p.zipcode].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    // --- Render Logic ---
    if (!profile || !editedProfile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>{t('dashboard.loading', 'Loading your profile…')}</Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Header */}
            <header className="header">
                {/* ... Header content ... */}
                <div className="header-left-group">
                    <Link to="/home" className="nav-logo">
                        <img src={LogoSymbol} alt={t('common.logoAlt', 'Logo')} className="home-logo" />
                    </Link>
                    <LanguageSwitcher />
                </div>
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                <nav className={`nav ${menuOpen ? "open" : ""}`}>
                    <Link to="/map" onClick={() => setMenuOpen(false)}>{t('navbar.map', 'Map')}</Link>
                    <a href="/home#helpful-resources" onClick={(e) => { e.preventDefault(); navigate('/home'); setTimeout(() => { const el = document.getElementById('helpful-resources'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); setMenuOpen(false); }} className="nav-link">{t('navbar.resources', 'Resources')}</a>
                    <Link to="/userdashboard" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold' }}>{t('navbar.dashboard', 'Dashboard')}</Link>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }}>{t('navbar.logout', 'Logout')}</button>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="dashboard-main">

                {/* --- Left Sidebar: Saved Locations --- */}
                <aside className="sidebar-left">
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                {t('dashboard.savedLocations', 'Saved Locations')}
                            </Typography>

                            {loadingFavorites ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : favorites.length > 0 ? (
                                <List dense>
                                    {favorites.slice(0, 5).map((fav, index) => {
                                        // build your Maps URL however you like:
                                        const mapsUrl = fav.placeId
                                            ? `https://www.google.com/maps/place/?q=place_id:${fav.placeId}`
                                            : fav.lat && fav.lng
                                                ? `https://www.google.com/maps/search/?api=1&query=${fav.lat},${fav.lng}`
                                                : null;

                                        return (
                                            <ListItem
                                                key={fav.favoriteId || fav.placeId || index}
                                                sx={{ flexDirection: 'column', alignItems: 'flex-start', pl: 0, pr: 0 }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                                                        <LocationOnIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={fav.name || 'Unnamed Location'}
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            noWrap: true,
                                                            title: fav.name || 'Unnamed Location',
                                                        }}
                                                    />
                                                </Box>

                                                {fav.website && (
                                                    <Typography
                                                        variant="caption"
                                                        component="a"
                                                        href={fav.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        noWrap
                                                        sx={{ mt: 0.5, textDecoration: 'none', color: 'primary.main' }}
                                                        title={fav.website}
                                                    >
                                                        {fav.website.replace(/^https?:\/\//, '')}
                                                    </Typography>
                                                )}

                                                {mapsUrl && (
                                                    <Typography
                                                        variant="caption"
                                                        component="a"
                                                        href={mapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        noWrap
                                                        sx={{ mt: 0.25, textDecoration: 'none', color: 'primary.main', fontStyle: 'italic' }}
                                                        title="Open in Google Maps"
                                                    >
                                                        {t('dashboard.viewOnMap', 'Get Directions')}
                                                    </Typography>
                                                )}
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    {t('dashboard.noSavedLocations', "You haven't saved any locations yet.")}
                                </Typography>
                            )}
                        </CardContent>

                        {(favorites.length > 5 || (favorites.length === 0 && !loadingFavorites)) && (
                            <CardActions sx={{ justifyContent: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                                {favorites.length > 5 && (
                                    <Button size="small" component={Link} to="/saved-locations">
                                        {t('common.seeAll', 'See All')} ({favorites.length})
                                    </Button>
                                )}
                                {favorites.length === 0 && (
                                    <Button size="small" component={Link} to="/map">
                                        {t('dashboard.findLocations', 'Find Locations on Map')}
                                    </Button>
                                )}
                            </CardActions>
                        )}
                    </Card>

                    <Box sx={{ height: 18 }} />

                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {t("dashboard.addElderly", "Add Elderly")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t("dashboard.addElderlyHelp", "Select an elder to link to your profile.")}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
                            <Button size="small" onClick={() => setOpenAddElder(true)}>
                                {t("dashboard.addElder", "Add Elder")}
                            </Button>
                        </CardActions>
                    </Card>


                    {!loadingElders && elders.length > 0 && (
                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{t('caregiverDashboard.yourEldersTitle', 'Your Elders')}</Typography>
                                <List dense>
                                    {elders.map(elder => (
                                        <ListItem
                                            key={elder.userId}
                                            sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    component={Link}
                                                    to={`/elder/${elder.userId}`}
                                                    sx={{
                                                        textDecoration: 'none',
                                                        color: 'primary.main',
                                                        fontWeight: 500,
                                                        flexGrow: 1
                                                    }}
                                                >
                                                    {elder.firstName} {elder.lastName}
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={() => handleOpenMessage(elder)}
                                                    sx={{ fontSize: '0.75rem', minWidth: 'auto', p: 0.5, ml: 2 }}
                                                >
                                                    {t('caregiverDashboard.messageButton', 'Message')}
                                                </Button>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0 }}>
                                                {elder.email}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}



                </aside>



                {/* --- Main Content: Merged Profile Details (Left/Right Layout) --- */}
                <section className="main-content">
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {/* Left Column: Avatar/Name */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, pt: 2 }}>
                                    <Avatar sx={{ width: 80, height: 80, fontSize: 40, mb: 1, bgcolor: 'primary.main' }}> {(profile.firstName?.charAt(0)?.toUpperCase() || '') + (profile.lastName?.charAt(0)?.toUpperCase() || '?')} </Avatar>
                                    <Typography variant="h6" component="h2" sx={{ wordBreak: 'break-word', textAlign: 'center' }}> {profile.firstName} {profile.lastName} </Typography>
                                </Box>
                                {/* Right Column: Details */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" component="h2"> {t('profile.detailsTitle', 'Profile Details')} </Typography>
                                        {!isEditing && (<Button size="small" startIcon={<EditIcon />} onClick={handleEditToggle} disabled={isSaving}> {t('common.edit', 'Edit')} </Button>)}
                                    </Box>
                                    <List dense>
                                        {/* Email */}
                                        <ListItem disablePadding sx={{ pt: 1, pb: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><EmailIcon fontSize="small" color="action" /></ListItemIcon>
                                            <ListItemText primary={t('profile.emailLabel', 'Email:')} secondary={profile.email || '-'} /* ...props... */ />
                                        </ListItem>
                                        <Divider component="li" light sx={{ mt: 0, mb: 1 }} />

                                        {/* Phone (Displays formatted number or '-') */}
                                        <ListItem disablePadding sx={{ pt: 1, pb: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><PhoneIcon fontSize="small" color="action" /></ListItemIcon>
                                            {isEditing ? (
                                                <TextField label={t('profile.phoneLabel', 'Phone:')} name="phone" value={editedProfile.phone || ''} onChange={handleInputChange} variant="standard" size="small" fullWidth disabled={isSaving} placeholder={t('profile.phonePlaceholder', '(XXX) XXX-XXXX or digits')} type="tel" />
                                            ) : (
                                                <ListItemText
                                                    primary={t('profile.phoneLabel', 'Phone:')}
                                                    secondary={formatPhoneNumber(profile.phone) || '-'} // Format or show '-'
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', sx: { fontWeight: 500 } }}
                                                />
                                            )}
                                        </ListItem>
                                        <Divider component="li" light sx={{ mt: 0, mb: 1 }} />

                                        {/* Address (Displays formatted or '-') */}
                                        <ListItem disablePadding sx={{ pt: 1, pb: 1, display: 'block' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: isEditing ? 1 : 0 }}>
                                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><HomeIcon fontSize="small" color="action" /></ListItemIcon>
                                                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}> {t('profile.addressLabel', 'Address:')} </Typography>
                                            </Box>
                                            {isEditing ? (
                                                <Box sx={{ pl: 4.5 }}>
                                                    <TextField label={t('profile.streetLabel', 'Street')} name="street" value={editedProfile.street || ''} onChange={handleInputChange} variant="standard" size="small" fullWidth sx={{ mb: 1 }} disabled={isSaving} placeholder={t('profile.streetPlaceholder', 'Street address')} />
                                                    <TextField label={t('profile.cityLabel', 'City')} name="city" value={editedProfile.city || ''} onChange={handleInputChange} variant="standard" size="small" fullWidth sx={{ mb: 1 }} disabled={isSaving} placeholder={t('profile.cityPlaceholder', 'City')} />
                                                    <TextField label={t('profile.stateLabel', 'State')} name="state" value={editedProfile.state || ''} onChange={handleInputChange} variant="standard" size="small" fullWidth sx={{ mb: 1 }} disabled={isSaving} placeholder={t('profile.statePlaceholder', 'State/Province')} />
                                                    <TextField label={t('profile.zipcodeLabel', 'Zip Code')} name="zipcode" value={editedProfile.zipcode || ''} onChange={handleInputChange} variant="standard" size="small" fullWidth disabled={isSaving} placeholder={t('profile.zipcodePlaceholder', 'Postal/Zip code')} />
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500, pl: 4.5, mt: -1 }}>
                                                    {formatAddress(profile) || '-'} {/* Format or show '-' */}
                                                </Typography>
                                            )}
                                        </ListItem>
                                    </List>
                                </Box>
                            </Box>
                        </CardContent>
                        {/* Save/Cancel Actions */}
                        {isEditing && (
                            <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                                <Button onClick={handleCancel} startIcon={<CancelIcon />} disabled={isSaving}> {t('common.cancel', 'Cancel')} </Button>
                                <Button onClick={handleSave} variant="contained" startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} disabled={isSaving} > {t('common.save', 'Save Changes')} </Button>
                            </CardActions>
                        )}
                    </Card>
                </section>

            </main>

            <Dialog open={openAddElder} onClose={() => setOpenAddElder(false)}>
                <DialogTitle>{t("dashboard.addElder", "Add Elder")}</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    <TextField
                        label={t("dashboard.elderId", "Elder User ID")}
                        value={elderId}
                        onChange={(e) => setElderId(e.target.value)}
                        type="number"
                        fullWidth
                    />
                    <TextField
                        label={t("dashboard.elderEmail", "Elder Email")}
                        value={elderEmail}
                        onChange={(e) => setElderEmail(e.target.value)}
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddElder(false)}>
                        {t("common.cancel", "Cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLinkElder}
                        disabled={!elderId.trim()}
                    >
                        {t("common.save", "Link Elder")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openMessageDialog}
                onClose={() => setOpenMessageDialog(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '16px'
                    }
                }}
            >
                <DialogTitle>
                    Send Message to {currentElder?.firstName} {currentElder?.lastName}
                </DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        label="Your Message"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        multiline
                        rows={10}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {messageText.length}/250
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default CaregiverDashboard;