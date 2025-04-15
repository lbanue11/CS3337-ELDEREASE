import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { getEldercareByZip } from "./api/eldercare";
import xml2js from "xml2js";
import "./MapComponent.css"; // 🌟 All styles come from here

const libraries = ["places"];

/* These are just settings for how the map will look, Can change depending our theme*/

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

  const handleSearch = async () => {

    /* This doesn't work. Fix later */
    try {
      const xml = await getEldercareByZip(zip);
      const result = await xml2js.parseStringPromise(xml);
      const agencies =
        result?.["soap:Envelope"]?.["soap:Body"]?.[0]?.["GetAgenciesByZipResponse"]?.[0]
          ?.["GetAgenciesByZipResult"]?.[0]?.["diffgr:diffgram"]?.[0]?.["NewDataSet"]?.[0]
          ?.["Table"] || [];

      const geocoded = await Promise.all(
        agencies.map(async (agency) => {
          const fullAddress = `${agency.Address[0]}, ${agency.City[0]}, ${agency.State[0]} ${agency.Zip[0]}`;
          const geoRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              fullAddress
            )}&key=AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts`
          );
          const geoData = await geoRes.json();
          const loc = geoData.results?.[0]?.geometry?.location;
          return loc
            ? {
                name: agency.Name[0],
                lat: loc.lat,
                lng: loc.lng,
              }
            : null;
        })
      );

      const validMarkers = geocoded.filter(Boolean);
      setMarkers(validMarkers);
      if (validMarkers.length > 0) {
        setCenter({ lat: validMarkers[0].lat, lng: validMarkers[0].lng });
      }
    } catch (err) {
      console.error("Failed to fetch agencies:", err);
    }
  };


  /* We ask user for location and then show them stuff close to them */
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
            /* we use elderare as keyword to find any senior services. might need to change it 
              depending on our needs */
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
              onClick={() => setSelectedPlace(place)}
            />
          ))}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.lat,
                lng: selectedPlace.lng,
              }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="info-window">
                <strong>{selectedPlace.name}</strong>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
