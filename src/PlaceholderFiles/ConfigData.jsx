import React, { useState } from "react";

const ConfigData = [
  {
    name: "Camera 1",
    path: "/mavs_ros/image",
    cName: "topic",
  },
  {
    name: "Global Path",
    path: "/nature/global_path",
    cName: "topic",
  },
  {
    name: "Local Path",
    path: "/nature/local_path",
    cName: "topic",
  },
  {
    name: "Occupancy Grid",
    path: "/nature/occupancy_grid",
    cName: "topic",
  },
  {
    name: "Odometry",
    path: "/nature/odometry",
    cName: "topic",
  },
  {
    name: "IMU",
    path: "/mavs_ros/imu",
    cName: "topic",
  },
  {
    name: "Point Cloud",
    path: "/nature/points",
    cName: "topic",
  },
  {
    name: "Waypoint",
    path: "/nature/waypoints",
    cName: "topic",
  },
];

export default ConfigData;
