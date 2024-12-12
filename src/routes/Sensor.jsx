import Camera from "../Components/Camera";
import { useRos } from "../Utils/RosConnProvider";
import PointCloud from "../Components/PointCloud";
import IMU from "../Components/IMU";
import Compass from "../Components/Compass";

export default function Sensor() {
  const { isCon } = useRos();

  return (
    <div id="sensor-tab" className="body">

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
        <PointCloud />
      ) : (
        <div className="card" id="PointCloud-card">
          <h3 className="card-title"> Lidar </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}

      {isCon ? (
        <Camera />
      ) : (
        <div className="card" id="Camera-card">
          <h3 className="card-title"> Camera </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}
      
      {isCon ? (
        <Compass />
      ) : (
        <div className="card" id="Compass-card">
          <h3 className="card-title"> Compass </h3>
          <div>
            No websocket connection.
          </div>
        </div>
      )}

    </div>
  );
}
