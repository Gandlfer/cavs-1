import React, { useEffect } from "react";
import Card from "../Components/Card";
import Camera from "../Components/Camera";
import { RosProvider, useRos } from "../Utils/RosConnProvider";
import PointCloud from "../Components/PointCloud";
import IMU from "../Components/IMU";
import Compass from "../Components/Compass";

export default function Sensor() {
  const { isCon } = useRos();

  return (
    <div id="sensor-tab" className="body">
      {isCon ? (
        <Camera />
      ) : (
        <div className="card">
          <h3 className="card-title"> Camera </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}
      {isCon ? (
        <PointCloud />
      ) : (
        <div className="card">
          <h3 className="card-title"> Lidar </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}

      {isCon ? (
        <IMU />
      ) : (
        <div className="card" id="IMU-card">
          <h3 className="card-title"> IMU </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}

      {isCon ? (
        <Compass />
      ) : (
        <div className="card" id="compass-card">
          <h3 className="card-title"> Compass </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}

    </div>
  );
}
