import React from "react";
import PointCloud from "../Components/PointCloud";
import Occupancy from "../Components/Occupancy"
import { useRos } from "../Utils/RosConnProvider";
import Waypoints from "../Components/Waypoints";
import GlobalPath from "../Components/GlobalPath";

export default function Map() {
  const { isCon } = useRos();
  return (
    <div id="map-tab" className="body">
      {isCon ? (
        <GlobalPath />
      ) : (
        <div className="card">
          <h3 className="card-title"> Global Path </h3>
          <p> No websocket connection.</p>
        </div>
      )}
      {isCon ? (
        <Waypoints />
      ) : (
        <div className="card">
          <h3 className="card-title"> Global Path </h3>
          <p> No websocket connection.</p>
        </div>
      )}
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
