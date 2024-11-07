import React from "react";
import Card from "../Components/Card";
import "../index.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "./Map.css";
import { MdHeight } from "react-icons/md";
import MapComponent from "../Components/MapComponent";

export default function Map() {
  return (
    <div id="map-tab" className="body">
      <div id="map" className="card">
        {/* <MapContainer
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
        </MapContainer> */}
        <MapComponent />
      </div>
      <div className="card">
        <h3 className="card-title"> Lidar </h3>
        <img
          className="sample-img"
          src="https://cdn.discordapp.com/attachments/1281269784415309956/1301304999296503909/image.png?ex=672de178&is=672c8ff8&hm=b4b2c86687aa161d59ff70cb54a579998afdb434f325913c32d5e259b9ee27f3&"
          alt="lidar"
        />
      </div>
      <div className="card">
        <h3 className="card-title"> Occupancy grid </h3>
        <img
          className="sample-img"
          src="https://raw.githubusercontent.com/KristofRobot/frobo/master/bagfile/rviz_odom.png"
          alt="occupancy grid sample"
        />
      </div>
    </div>
  );
}
