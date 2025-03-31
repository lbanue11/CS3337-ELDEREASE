import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100vw",
    height: "100vh"
};

const center = {
    lat: 34.0522,  // pointing at Los Angeles
    lng: -118.2437
};

export default function MapComponent() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts"
    });

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
        >
            <Marker position={center} />
        </GoogleMap>
    );
}