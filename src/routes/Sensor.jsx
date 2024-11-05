import React, { useEffect } from "react";
import Card from "../Components/Card";
import Camera from "../Components/Camera";
import { RosProvider, useRos } from "../Utils/RosConnProvider";
import PointCloud from "../Components/PointCloud";
import IMU from "../Components/IMU";

export default function Sensor() {
  const { isCon } = useRos();

  return (
    <div id="sensor-tab" className="body">
      {isCon ? <Camera /> : <div className="card">
          <h3 className="card-title"> Camera </h3>
          <img
            className="sample-img"
            src="https://cdn.discordapp.com/attachments/1281269784415309956/1301304999296503909/image.png?ex=6723fe38&is=6722acb8&hm=2581bbd0e2f7da664dd50e680d473d7216046b9fb4de029836d4b9d8f809669c&"
            alt="lidar"
          />
        </div>}
      {isCon ? (
        <PointCloud />
      ) : (
        <div className="card">
          <h3 className="card-title"> Lidar </h3>
          <img
            className="sample-img"
            src="https://cdn.discordapp.com/attachments/1281269784415309956/1301304999296503909/image.png?ex=6723fe38&is=6722acb8&hm=2581bbd0e2f7da664dd50e680d473d7216046b9fb4de029836d4b9d8f809669c&"
            alt="lidar"
          />
        </div>
      )}

      <div className="card">
        <h3 className="card-title"> Sensor Fusion </h3>
        <img
          className="sample-img"
          src="https://iacopomc.github.io/assets/images/sensor-fusion-tracking-post/img_pcl.JPG"
          alt="lidar sensor fusion"
        />
      </div>
      {isCon ? <IMU/> :
      <div className="card" id="IMU-card">
        <h3 className="card-title"> IMU </h3>
        <img
          className="sample-img"
          src="https://www.allaboutcircuits.com/uploads/articles/GimbalsInSphericalPlot_GimbalLock_ExternalRings.gif"
          alt="IMU visualization"
        />
      </div>
      }
    </div>
  );
}
