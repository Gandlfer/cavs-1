import React from "react";
import PointCloud from "../Components/PointCloud";
import Occupancy from "../Components/Occupancy"
import Card from "../Components/Card";
import "../index.css";
import "./Map.css";
import { useRos } from "../Utils/RosConnProvider";
import MapComponent from "../Components/MapComponent";

export default function Map() {
  const { isCon } = useRos();
  return (
    <div id="map-tab" className="body">
      <div id="map" className="card">
        <MapComponent />
      </div>
      {isCon ? (
        <PointCloud />
      ) : (
        <div className="card">
          <h3 className="card-title"> Lidar </h3>
          <p> No websocket connection.</p>
        </div>
      )}
      {isCon ? (
        <Occupancy />
      ) : (
        <div className="card">
          <h3 className="card-title"> Occupancy Grid </h3>
          <p> No websocket connection.</p>
        </div>
      )}
    </div>
  );
}
