const ConfigData = {topics: [
  {
    name: "Camera",
    path: "/mavs_ros/image",
  },
  {
    name: "Global Path",
    path: "/nature/global_path",
  },
  {
    name: "Occupancy Grid",
    path: "/occupancy_grid_image",
  },
  {
    name: "Odometry",
    path: "/nature/odometry",
  },
  {
    name: "IMU",
    path: "/mavs_ros/imu",
  },
  {
    name: "Point Cloud",
    path: "/nature/points",
  },
  {
    name: "Waypoint",
    path: "/nature/waypoints",
  }], 
  serverURL: "localhost:9090"
};

export default ConfigData;
