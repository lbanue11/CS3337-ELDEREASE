import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./MapComponent.css";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from "react-router-dom";
import LogoSymbol from "./assets/LogoSymbol.png";
import LanguageSwitcher from './components/LanguageSwitcher';

const libraries = ["places"];
const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#eaf0f6" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#333" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ color: "#ffffff" }] },
    { featureType: "water", stylers: [{ color: "#cde4f6" }] },
  ],
};

const Maps_API_KEY = "AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts";

export default function MapComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: Maps_API_KEY,
    libraries,
  });

  const [zip, setZip] = useState("");
  const [center, setCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(["eldercare"]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const categoryOptions = [
    { label: t('mapPage.controls.categories.nursingHome'), value: 'nursing home' },
    { label: t('mapPage.controls.categories.homeCare'), value: 'home care' },
    { label: t('mapPage.controls.categories.assistedLiving'), value: 'assisted living' },
    { label: t('mapPage.controls.categories.hospice'), value: 'hospice' },
    { label: t('mapPage.controls.categories.transportation'), value: 'transportation' },
  ];

  const toggleCategory = (value) => {
    setSelectedCategories(prev =>
        prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value]
    );
  };

  useEffect(() => {
    axios
        .get("/api/profile")
        .then(res => {
          setProfile(res.data);
        })
        .catch(err => {
          if (err.response?.status === 401) {
            navigate("/login", { replace: true });
          } else {
            console.error("Failed to load profile:", err);
          }
        });
  }, [navigate]);

  useEffect(() => {
    if (!selectedPlace) {
      setReviews([]);
      return;
    }
    axios.get(`/api/google-reviews/${selectedPlace.placeId}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error('Failed to load reviews', err));
  }, [selectedPlace]);

  const handleSubmitReview = async () => {
    if (!selectedPlace || !newReview.trim()) return;
    try {
      await axios.post("/api/google-reviews", {
        authorName: `${profile.firstName} ${profile.lastName}`,  // <-- use profile here
        date: new Date().toISOString().split("T")[0],
        rating: selectedRating,
        comment: newReview,
        placeId: selectedPlace.placeId,
      });
      setNewReview("");
      const { data } = await axios.get(`/api/google-reviews/${selectedPlace.placeId}`);
      setReviews(data);
    } catch (err) {
      console.error("Review submission error:", err);
      alert(t('mapPage.alerts.reviewSubmitFailed'));
    }
  };


  const handleFavorite = async () => {
    if (!selectedPlace) return;
    try {
      await axios.post("/api/google-favorites", {
        placeId: selectedPlace.placeId,
        name: selectedPlace.name,
        address: selectedPlace.address,
        phone: selectedPlace.phone,
        website: selectedPlace.website,
        googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`,
      });
      alert(t('mapPage.alerts.favoriteAdded'));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const fetchPlaceDetails = (placeId) => {
    if (!window.google?.maps?.places) return;
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);
    service.getDetails({ placeId, fields: ["name","formatted_address","formatted_phone_number","website","place_id","geometry"] },
        (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSelectedPlace({
              name: details.name,
              address: details.formatted_address,
              phone: details.formatted_phone_number,
              website: details.website,
              placeId: details.place_id,
              lat: details.geometry.location.lat(),
              lng: details.geometry.location.lng(),
            });
          }
        }
    );
  };

  const fetchGooglePlacesResults = async (location, keywords) => {
    const all = [];
    const searchTerms = keywords.length ? keywords : ['eldercare'];
    for (const term of searchTerms) {
      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);
      await new Promise(resolve => {
        service.nearbySearch({ location, radius: 5000, keyword: term }, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(p => all.push({
              name: p.name,
              lat: p.geometry.location.lat(),
              lng: p.geometry.location.lng(),
              placeId: p.place_id,
              address: p.vicinity,
            }));
          }
          resolve();
        });
      });
    }
    // dedupe
    return Array.from(new Map(all.map(i => [i.placeId, i])).values());
  };

  const handleSearch = async () => {
    if (!zip.trim()) return;
    setSelectedPlace(null);
    setMarkers([]);
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${Maps_API_KEY}`);
      const data = await res.json();
      const loc = data.results?.[0]?.geometry.location;
      if (!loc) return;
      setCenter(loc);
      const results = await fetchGooglePlacesResults(loc, selectedCategories);
      setMarkers(results);
    } catch (err) {
      console.error('Search by ZIP failed:', err);
    }
  };

  const handleUseMyLocation = () => {
    setSelectedPlace(null);
    setMarkers([]);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setCenter(loc);
      const results = await fetchGooglePlacesResults(loc, selectedCategories);
      setMarkers(results);
    });
  };

  const handleLogout = () => {
    axios.post("/api/auth/logout").finally(() => navigate("/login"));
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
      <>
        <header className="header">
          <div className="header-left-group">
            <Link to="/home" className="nav-logo"><img src={LogoSymbol} alt="Logo" /></Link>
            <LanguageSwitcher />
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            {profile && (
                <Link
                    to={profile.role === "ADMIN" ? "/admin" : "/userdashboard"}
                    onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.dashboard")}
                </Link>
            )}
            <Link to="/map" onClick={() => setMenuOpen(false)} style={{ pointerEvents: 'none', opacity: 0.6 }}>{t('navbar.map')}</Link>
            <a href="/home#helpful-resources" onClick={e => { e.preventDefault(); navigate('/home'); setMenuOpen(false); }}>{t('navbar.resources')}</a>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}>{t('navbar.logout')}</button>
          </nav>
        </header>

        <div className="map-wrapper fade-in">
          <div className="map-controls">
            <h2>{t('mapPage.controls.title')}</h2>
            <div className="form-group">
              <input type="text" placeholder={t('mapPage.controls.zipPlaceholder')} value={zip} onChange={e => setZip(e.target.value)} />
              <div className="checkbox-group">
                {categoryOptions.map(opt => (
                    <label key={opt.value}>
                      <input type="checkbox" value={opt.value} checked={selectedCategories.includes(opt.value)} onChange={() => toggleCategory(opt.value)} />
                      {opt.label}
                    </label>
                ))}
              </div>
              <button className="btn-zip" onClick={handleSearch}>{t('mapPage.controls.searchButton')}</button>
              <button className="btn-location" onClick={handleUseMyLocation}>{t('mapPage.controls.useMyLocationButton')}</button>
            </div>
          </div>

          <div className="map-container-wrapper">
            <GoogleMap mapContainerClassName="map-container" center={center} zoom={11} options={mapOptions}>
              {markers.map((place, i) => (
                  <Marker key={place.placeId || i} position={{ lat: place.lat, lng: place.lng }} onClick={() => fetchPlaceDetails(place.placeId)} title={place.name} />
              ))}
            </GoogleMap>

            {selectedPlace && (
              <div className="details-panel">
                <button className="close-button" onClick={() => setSelectedPlace(null)}>×</button>
                <h3>{selectedPlace.name}</h3>
                {selectedPlace.address && <p>{selectedPlace.address}</p>}
                {selectedPlace.phone   && <p>📞 {selectedPlace.phone}</p>}
                {selectedPlace.website && (
                  <p>
                    <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
                <p>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in Google Maps
                  </a>
                </p>

                <div className="review-section">
                  <h4>{t('mapPage.details.leaveReviewTitle')}</h4>
                  <textarea
                    rows={3}
                    placeholder={t('mapPage.details.reviewPlaceholder')}
                    value={newReview}
                    onChange={e => setNewReview(e.target.value)}
                  />
                  <select
                    value={selectedRating}
                    onChange={e => setSelectedRating(Number(e.target.value))}
                  >
                    {[1,2,3,4,5].map(r => (
                      <option key={r} value={r}>
                        {t('mapPage.details.ratingOptions.star',{count:r})}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSubmitReview}>
                    {t('mapPage.details.submitReviewButton')}
                  </button>
                </div>

                <div className="review-list">
                  <h4>{t('mapPage.details.reviewsTitle')}</h4>
                  {reviews.length === 0 ? (
                    <p>{t('mapPage.details.noReviews')}</p>
                  ) : (
                    reviews.map((rev,i) => (
                      <div key={rev.id||i} className="review-card">
                        <div className="review-card-header">
                          <span className="review-author">{rev.authorName}</span>
                          <span className="review-rating">⭐ {rev.rating}</span>
                        </div>
                        <p className="review-text">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
  );
}
