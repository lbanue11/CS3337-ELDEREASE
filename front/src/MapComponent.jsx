import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import { getEldercareByZip } from "./api/eldercare";
import xml2js from "xml2js";
import "./MapComponent.css";

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

export default function MapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts",
    libraries,
  });

  
  const [zip, setZip] = useState("");
  const [center, setCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

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
          "geometry"
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

      setCenter({ lat: location.lat, lng: location.lng });

      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);

      service.nearbySearch(
        {
          location: location,
          radius: 5000,
          keyword: "eldercare",
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const places = results.map((place) => ({
              name: place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              placeId: place.place_id,
              address: place.vicinity || "",
            }));
            setMarkers(places);
          } else {
            console.error("Places API error:", status);
          }
        }
      );
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
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });

        const map = new window.google.maps.Map(document.createElement("div"));
        const service = new window.google.maps.places.PlacesService(map);

        service.nearbySearch(
          {
            location: { lat: latitude, lng: longitude },
            radius: 5000,
            keyword: "eldercare",
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const nearbyPlaces = results.map((place) => ({
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                placeId: place.place_id,
                address: place.vicinity || "",
              }));
              setMarkers(nearbyPlaces);
            } else {
              console.error("API error:", status);
            }
          }
        );
      },
      (err) => {
        console.error("Location error:", err);
        alert("Could not get your location.");
      }
    );
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  // Form for map using ZIP/Location and filter
  return (
    <div className="map-wrapper">
      <div className="map-controls">
        <h2>Find Nearby Services</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <button className="btn-zip" onClick={handleSearch}>
            Search by ZIP
          </button>
          <button className="btn-location" onClick={handleUseMyLocation}>
            Use My Location
          </button>
        
          <button className="btn-filter" onClick={() => alert("Filters coming soon!")}>
              ⚙️ Filter Services
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
            <button onClick={() => setSelectedPlace(null)} className="close-button">×</button>
            <h3>{selectedPlace.name}</h3>
            {selectedPlace.address && <p>{selectedPlace.address}</p>}
            {selectedPlace.phone && <p>📞 {selectedPlace.phone}</p>}
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
          </div>
        )}
      </div>
    </div>
  );
}
