import React, { useEffect } from "react";
import Card from "../Components/Card";
import Camera from "../Components/Camera";
import { RosProvider, useRos } from "../Utils/RosConnProvider";
import PointCloud from "../Components/PointCloud";

export default function Sensor() {
  const { isCon } = useRos();

  return (
    <div id="sensor-tab" className="body">
      {isCon ? <Camera/> : <Card />}
      {isCon ? <PointCloud/> : <div className="card">
        <h3 className="card-title"> Lidar </h3>
        <img
          className="sample-img"
          src="https://s3-prod.autonews.com/s3fs-public/Velodyne_Lidar_Alpha_Prime-01_i.jpg"
          alt="lidar"
        />
      </div>}

      <div className="card">
        <h3 className="card-title"> Sensor Fusion </h3>
        <img
          className="sample-img"
          src="https://iacopomc.github.io/assets/images/sensor-fusion-tracking-post/img_pcl.JPG"
          alt="lidar sensor fusion"
        />
      </div>
      <div className="card" id="IMU-card">
        <h3 className="card-title"> IMU </h3>
        <img
          className="sample-img"
          src="https://www.allaboutcircuits.com/uploads/articles/GimbalsInSphericalPlot_GimbalLock_ExternalRings.gif"
          alt="IMU visualization"
        />
      </div>
    </div>
  );
}
