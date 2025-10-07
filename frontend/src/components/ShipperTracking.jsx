import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const shipperIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});
const homeIcon = new L.Icon({
  iconUrl: home,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});
function ShipperTracking({ data }) {
  const shipperLatitude = data.shipperLocation.latitude;
  const shipperLongitude = data.shipperLocation.longitude;
  const customerLatitude = data.customerLocation.latitude;
  const customerLongitude = data.customerLocation.longitude;

  const path = [
    [shipperLatitude, shipperLongitude],
    [customerLatitude, customerLongitude],
  ];

  const center = [shipperLatitude, shipperLongitude];
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4 font-sans mt-4">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[shipperLatitude, shipperLongitude]}
          icon={shipperIcon}
        >
          <Popup>Shipper Location</Popup>
        </Marker>
        <Marker
          position={[customerLatitude, customerLongitude]}
          icon={homeIcon}
        >
          <Popup>Customer Location</Popup>
        </Marker>
        <Polyline positions={path} color="#F59E0B" />
      </MapContainer>
    </div>
  );
}

export default ShipperTracking;
