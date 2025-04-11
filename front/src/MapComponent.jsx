import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getEldercareByZip } from "./api/eldercare";
import xml2js from "xml2js";

const containerStyle = {
    width: "100vw",
    height: "100vh",
};

const libraries = ["places"];

export default function MapComponent() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts",
        libraries,
    });

    const [zip, setZip] = useState("90001");
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState({
        lat: 34.0522,
        lng: -118.2437,
    });

    const handleSearch = async () => {
        try {
            const xml = await getEldercareByZip(zip);
            const result = await xml2js.parseStringPromise(xml);

            const agencies = result?.["soap:Envelope"]?.["soap:Body"]?.[0]?.["GetAgenciesByZipResponse"]?.[0]?.["GetAgenciesByZipResult"]?.[0]?.["diffgr:diffgram"]?.[0]?.["NewDataSet"]?.[0]?.["Table"] || [];

            const geocoded = await Promise.all(agencies.map(async (agency) => {
                const fullAddress = `${agency.Address[0]}, ${agency.City[0]}, ${agency.State[0]} ${agency.Zip[0]}`;
                const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts`);
                const geoData = await geoRes.json();
                const loc = geoData.results?.[0]?.geometry?.location;
                return loc ? {
                    name: agency.Name[0],
                    lat: loc.lat,
                    lng: loc.lng,
                } : null;
            }));

            const validMarkers = geocoded.filter(Boolean);
            setMarkers(validMarkers);
            if (validMarkers.length > 0) {
                setCenter({ lat: validMarkers[0].lat, lng: validMarkers[0].lng });
            }
        } catch (err) {
            console.error("Failed to fetch agencies:", err);
        }
    };

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <>
            {/* Search Bar */}
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 999 }}>
                <input
                    type="text"
                    placeholder="Enter ZIP"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        width: "180px",
                        marginRight: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "10px 16px",
                        fontSize: "16px",
                        backgroundColor: "#f4a261",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {/* Map */}
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
                {markers.map((place, i) => (
                    <Marker
                        key={i}
                        position={{ lat: place.lat, lng: place.lng }}
                        title={place.name}
                    />
                ))}
            </GoogleMap>
        </>
    );
}