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
          <img
            className="sample-img"
            src="https://cdn.discordapp.com/attachments/1281269784415309956/1301304999296503909/image.png?ex=6723fe38&is=6722acb8&hm=2581bbd0e2f7da664dd50e680d473d7216046b9fb4de029836d4b9d8f809669c&"
            alt="Camera"
          />
        </div>
      )}
      {isCon ? (
        <PointCloud />
      ) : (
        <div className="card">
          <h3 className="card-title"> Lidar </h3>
          <img
            className="sample-img"
            src="https://cdn.discordapp.com/attachments/1281269784415309956/1301304999296503909/image.png?ex=672de178&is=672c8ff8&hm=b4b2c86687aa161d59ff70cb54a579998afdb434f325913c32d5e259b9ee27f3&"
            alt="lidar"
          />
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

      {isCon ? (
        <IMU />
      ) : (
        <div className="card" id="IMU-card">
          <h3 className="card-title"> IMU </h3>
          <img
            className="sample-img"
            src="https://www.allaboutcircuits.com/uploads/articles/GimbalsInSphericalPlot_GimbalLock_ExternalRings.gif"
            alt="IMU visualization"
          />
        </div>
      )}
    </div>
  );
}
