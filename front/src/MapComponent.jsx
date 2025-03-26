import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 34.0522, // We can replace with our desired lat
    lng: -118.2437, // We can replace with our desired lng
};

function MapComponent() {
    return (
        <LoadScript googleMapsApiKey="AIzaSyB52D9GjkLcAkdQ9iXxro6ptMsD7Nv6Lts" libraries={['places']}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
            >
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
}

export default MapComponent;