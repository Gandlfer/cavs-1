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
import { polyline1 } from "./MapData";

export default function Map() {
  return (
    <div id="map-tab" className="body">
      <div id="map" className="card">
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
      </div>
      <div className="card">
        <h3 className="card-title"> Lidar </h3>
        <img
          className="sample-img"
          src="https://s3-prod.autonews.com/s3fs-public/Velodyne_Lidar_Alpha_Prime-01_i.jpg"
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
