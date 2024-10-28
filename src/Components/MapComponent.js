import { polyline1 } from "./MapData.jsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
const MapComponent = () => {
  return (
    <MapContainer
      center={[33.453892, -88.788887]}
      zoom={17}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[33.453892, -88.788887]}>
        <Popup>
          Start point <br /> Mississippi State University
        </Popup>
      </Marker>
      <Marker position={[33.452, -88.7884]}>
        <Popup>
          Destination <br /> Mississippi State University
        </Popup>
      </Marker>
      <Polyline pathOption={{ color: "red" }} positions={polyline1} />
    </MapContainer>
  );
};
export default MapComponent;
