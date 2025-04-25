import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getEldercareByZip } from "./api/eldercare";
import xml2js from "xml2js";
import "./MapComponent.css";
import axios from "axios";

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

const categoryOptions = [
  { label: "Nursing Homes", value: "nursing home" },
  { label: "Home Care", value: "home care" },
  { label: "Assisted Living", value: "assisted living" },
  { label: "Hospice", value: "hospice" },
  { label: "Transportation", value: "bus station" },
];

export default function MapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts",
    libraries,
  });

  const [zip, setZip] = useState("");
  const [center, setCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(["eldercare"]);

  const handleFavorite = async () => {
    if (!selectedPlace) return;
    try {
      await axios.post("/api/google-favorites", {
        placeId:        selectedPlace.placeId,
        name:           selectedPlace.name,
        address:        selectedPlace.address,
        phone:          selectedPlace.phone,
        website:        selectedPlace.website,
        googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`,
      });
      alert("Added to favorites! ❤️");
    } catch (err) {
      console.error("Favorite error:", err);
      alert(
          err.response?.status === 401
              ? "Please log in first."
              : "Failed to add favorite."
      );
    }
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const fetchPlaceDetails = (placeId) => {
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "website",
          "place_id",
          "geometry",
        ],
      },
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
        } else {
          console.error("Place Details error:", status);
        }
      }
    );
  };

  const fetchGooglePlacesResults = async (location, keywords) => {
    const allResults = [];
    for (const keyword of keywords.length ? keywords : ["eldercare"]) {
      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);

      await new Promise((resolve) => {
        service.nearbySearch(
          {
            location,
            radius: 5000,
            keyword,
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const mapped = results.map((place) => ({
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                placeId: place.place_id,
                address: place.vicinity || "",
              }));
              allResults.push(...mapped);
            }
            resolve();
          }
        );
      });
    }
    return allResults;
  };

  const handleSearch = async () => {
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts`
      );
      const geoData = await geoRes.json();
      const location = geoData.results?.[0]?.geometry?.location;

      if (!location) {
        alert("Could not find location for that ZIP code.");
        return;
      }

      setCenter(location);

      const googleMarkers = await fetchGooglePlacesResults(
        location,
        selectedCategories
      );
      setMarkers(googleMarkers);
    } catch (err) {
      console.error("Search by ZIP failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const location = { lat: latitude, lng: longitude };
        setCenter(location);

        const googleMarkers = await fetchGooglePlacesResults(
          location,
          selectedCategories
        );
        setMarkers(googleMarkers);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Could not get your location.");
      }
    );
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="map-wrapper fade-in">
      <div className="map-controls">
        <h2>Find Nearby Eldercare Services</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
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
            Search
          </button>
          <button className="btn-location" onClick={handleUseMyLocation}>
            Use My Location
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
              key={i}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => fetchPlaceDetails(place.placeId)}
            />
          ))}
        </GoogleMap>

        {selectedPlace && (
          <div className="details-panel">
            <button
              onClick={() => setSelectedPlace(null)}
              className="close-button"
            >
              ×
            </button>
            <h3>{selectedPlace.name}</h3>
            {selectedPlace.address && <p>{selectedPlace.address}</p>}
            {selectedPlace.phone && <p>📞 {selectedPlace.phone}</p>}
            {selectedPlace.website && (
              <p>
                <a
                  href={selectedPlace.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </p>
            )}

            <button className="btn-favorite" onClick={handleFavorite}>
              ❤️ Favorite
            </button>

            <p>
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View in Google Maps
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
