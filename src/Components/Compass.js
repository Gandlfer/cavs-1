import { useEffect, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import * as THREE from "three";

const Compass = () => {
  const { ros, isCon, refresh, topicSubDataRef, subscribedTopics } = useRos();
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    if (
      isCon &&
      "Odometry" in subscribedTopics.current &&
      subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
      "message" in
        topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
    ) {
      const odomMessage =
        topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
          .message;
      //Compass direction is the Y value
      setHeading( (getEuler(odomMessage).y) * 180 / Math.PI);
    }
  }, [ros, isCon, refresh]);

  //Determine direction

  if (heading){
    return (
      <div className="card">
        <h3 className="card-title"> Compass </h3>
        <div style={{ width: "100%", height: "100%" }}>
          <p>{`Heading: ${heading.toFixed(2)}°`}</p>
          <p>{getDirection(heading)}</p>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="card">
        <h3 className="card-title-warn"> Compass | No Odometry </h3>
        <div style={{ width: "100%", height: "100%" }}>
          <p>No data from {subscribedTopics.current["Odometry"].path}</p>
        </div>
      </div>
    );
  }
  
};

function getEuler(odomMessage) {
  const { x, y, z, w } = odomMessage.pose.pose.orientation;
  const quaternion = new THREE.Quaternion(x, y, z, w);
  const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");
  return euler;
}

function getDirection(deg) {
  //JIC degree is null
  if(!deg){
    return "No degree recieved"
  }

  //Normalize | Ensure it is a positive degreej
  if (deg < 0) deg += 360; 

  switch (true) {
    case (deg >= 337.5 || deg < 22.5):
      return "North";
    case (deg >= 22.5 && deg < 67.5):
      return "North-East";
    case (deg >= 67.5 && deg < 112.5):
      return "East";
    case (deg >= 112.5 && deg < 157.5):
      return "South-East";
    case (deg >= 157.5 && deg < 202.5):
      return "South";
    case (deg >= 202.5 && deg < 247.5):
      return "South-West";
    case (deg >= 247.5 && deg < 292.5):
      return "West";
    case (deg >= 292.5 && deg < 337.5):
      return "North-West";
    default:
      return "Invalid degree";
  }
}

export default Compass;
