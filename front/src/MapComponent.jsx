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
  const { t } = useTranslation()


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
  const [profile, setProfile] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    axios
      .post("/api/auth/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        navigate("/login");
      });
  };

  const categoryOptions = [
    { label: t('mapPage.controls.categories.nursingHome'), value: 'nursing home' },
    { label: t('mapPage.controls.categories.homeCare'), value: 'home care' },
    { label: t('mapPage.controls.categories.assistedLiving'), value: 'assisted living' },
    { label: t('mapPage.controls.categories.hospice'), value: 'hospice' },
    { label: t('mapPage.controls.categories.transportation'), value: 'transportation' },
  ];


  useEffect(() => {
    if (selectedPlace?.placeId) {
      axios
        .get(`/api/google-reviews/${selectedPlace.placeId}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Failed to load reviews", err));
    } else {
      setReviews([]);
    }
  }, [selectedPlace]);


  const handleSubmitReview = async () => {
    if (!selectedPlace || !newReview.trim()) return;
    try {
      await axios.post("/api/google-reviews", {
        place_id: selectedPlace.placeId,
        review_text: newReview,
        rating: selectedRating,
      });
      setNewReview("");
      const res = await axios.get(`/api/google-reviews/${selectedPlace.placeId}`);
      setReviews(res.data);
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
      console.error("Favorite error:", err);
      const alertKey = err.response?.status === 401 ? 'mapPage.alerts.pleaseLogIn' : 'mapPage.alerts.favoriteFailed';
      alert(t(alertKey));
    }
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const fetchPlaceDetails = (placeId) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps PlacesService not ready.");
      return;
    }
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId,
        fields: ["name", "formatted_address", "formatted_phone_number", "website", "place_id", "geometry"],
      },
      (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
          setSelectedPlace({
            name: details.name,
            address: details.formatted_address,
            phone: details.formatted_phone_number,
            website: details.website,
            placeId: details.place_id,
            lat: details.geometry?.location?.lat(),
            lng: details.geometry?.location?.lng(),
          });
        } else {
          console.error(`Place Details error for placeId ${placeId}: ${status}`);
        }
      }
    );
  };

  const fetchGooglePlacesResults = async (location, keywords) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps PlacesService not ready for search.");
      return [];
    }
    const allResults = [];
    const searchKeywords = keywords.length ? keywords : [t('mapPage.controls.categories.defaultSearchKeyword') || 'eldercare'];
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    for (const keyword of searchKeywords) {
      await new Promise((resolve) => {
        service.nearbySearch(
          { location, radius: 5000, keyword },
          (results, status, pagination) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              const mapped = results.map((place) => ({
                name: place.name,
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng(),
                placeId: place.place_id,
                address: place.vicinity || "",
              }));
              allResults.push(...mapped);
            } else if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              console.warn(`Nearby search for "${keyword}" failed or returned no results: ${status}`);
            }
            resolve();
          }
        );
      });
    }
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.placeId, item])).values());
    return uniqueResults;
  };

  const handleSearch = async () => {
    if (!zip.trim()) return;
    setSelectedPlace(null);
    setMarkers([]);
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${Maps_API_KEY}`
      );
      const geoData = await geoRes.json();
      const location = geoData.results?.[0]?.geometry?.location;

      if (!location) {
        alert(t('mapPage.alerts.zipNotFound'));
        return;
      }
      setCenter(location);
      const googleMarkers = await fetchGooglePlacesResults(location, selectedCategories);
      setMarkers(googleMarkers);
    } catch (err) {
      console.error("Search by ZIP failed:", err);
      alert(t('mapPage.alerts.searchFailed'));
    }
  };

  const handleUseMyLocation = () => {
    setSelectedPlace(null);
    setMarkers([]);
    if (!navigator.geolocation) {
      alert(t('mapPage.alerts.geolocationNotSupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const location = { lat: latitude, lng: longitude };
        setCenter(location);
        const googleMarkers = await fetchGooglePlacesResults(location, selectedCategories);
        setMarkers(googleMarkers);
      },
      (err) => {
        console.error("Location error:", err);
        alert(t('mapPage.alerts.locationError'));
      }
    );
  };


  if (loadError) return <div>{t('mapPage.loadError')}</div>;
  if (!isLoaded) return <div>{t('mapPage.loading')}</div>;


  return (
    <>
      <header className="header">
        <div className="header-left-group">
          <Link to="/home" className="nav-logo">
            <img src={LogoSymbol} alt={t('hotlinesPage.header.logoAlt')} />
          </Link>
          <LanguageSwitcher />
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {profile && (
              <Link
                  to={profile.role === "ADMIN" ? "/admin" : "/userdashboard"}
                  onClick={() => setMenuOpen(false)}
              >
                {t("navbar.dashboard")}
              </Link>
          )}
          <Link to="/map" onClick={() => setMenuOpen(false)} style={{ pointerEvents: 'none', opacity: 0.6 }}>
            {t('navbar.map')}
          </Link>
          <a href="/home#helpful-resources" onClick={(e) => { e.preventDefault(); navigate('/home'); setTimeout(() => { const el = document.getElementById('helpful-resources'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); setMenuOpen(false); }} className="nav-link">
            {t('navbar.resources')}
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            {t('navbar.logout')}
          </button>
        </nav>
      </header>

      <div className="map-wrapper fade-in">
        <div className="map-controls">
          <h2>{t('mapPage.controls.title')}</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder={t('mapPage.controls.zipPlaceholder')}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              aria-label={t('mapPage.controls.zipPlaceholder')}
            />
            <div className="checkbox-group">
              {categoryOptions.map((opt) => (
                <label key={opt.value}>
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={selectedCategories.includes(opt.value)}
                    onChange={() => toggleCategory(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button className="btn-zip" onClick={handleSearch}>
              {t('mapPage.controls.searchButton')}
            </button>
            <button className="btn-location" onClick={handleUseMyLocation}>
              {t('mapPage.controls.useMyLocationButton')}
            </button>
          </div>
        </div>

        <div className="map-container-wrapper">
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={11}
            options={mapOptions}
          >
            {markers.map((place, i) => (
              <Marker
                key={place.placeId || i}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => fetchPlaceDetails(place.placeId)}
                title={place.name}
              />
            ))}
          </GoogleMap>

          {selectedPlace && (
            <div className="details-panel">
              <button onClick={() => setSelectedPlace(null)} className="close-button" aria-label={t('mapPage.details.closeAlt') || "Close details"}>×</button>
              <h3>{selectedPlace.name}</h3>
              {selectedPlace.address && <p>{selectedPlace.address}</p>}
              {selectedPlace.phone && <p>{t('hotlinesPage.card.phonePrefix')}{selectedPlace.phone}</p>}
              {selectedPlace.website && <p><a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">{t('mapPage.details.visitWebsiteLink')}</a></p>}
              <button className="btn-favorite" onClick={handleFavorite}>{t('mapPage.details.favoriteButton')}</button>
              <p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}&query_place_id=${selectedPlace.placeId}`} target="_blank" rel="noopener noreferrer">{t('mapPage.details.viewInGoogleMapsLink')}</a></p>

              <div className="review-section">
                <h4>{t('mapPage.details.leaveReviewTitle')}</h4>
                <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} placeholder={t('mapPage.details.reviewPlaceholder')} rows={3} />
                <select value={selectedRating} onChange={(e) => setSelectedRating(Number(e.target.value))} aria-label={t('mapPage.details.ratingLabel') || "Rating"}>
                  {[1, 2, 3, 4, 5].map((r) => (<option key={r} value={r}>{t('mapPage.details.ratingOptions.star', { count: r })}</option>))}
                </select>
                <button onClick={handleSubmitReview}>{t('mapPage.details.submitReviewButton')}</button>
              </div>

              <div className="review-list">
                <h4>{t('mapPage.details.reviewsTitle')}</h4>
                {reviews.length === 0 ? (<p>{t('mapPage.details.noReviews')}</p>) : (reviews.map((rev, i) => (<div key={rev.review_id || i} className="review-entry"><p>⭐ {rev.rating || '-'}</p><p>{rev.review_text}</p><small>{rev.first_name || t('mapPage.details.reviewUserFallback')}</small></div>)))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}