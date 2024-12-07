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
      setHeading(getEuler(odomMessage).y);
    }
  }, [ros, isCon, refresh]);

  // Convert radians to degrees
  const radiansToDegrees = (radians) => (radians * 180) / Math.PI;

  return (
    <div className="card">
      <h3 className="card-title"> Compass </h3>
      <div style={{ width: "100%", height: "100%" }}>
        <p>{`Heading: ${radiansToDegrees(heading).toFixed(2)}°`}</p>
      </div>
    </div>
  );
};

function getEuler(odomMessage) {
  const { x, y, z, w } = odomMessage.pose.pose.orientation;
  const quaternion = new THREE.Quaternion(x, y, z, w);
  const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");
  return euler;
}

export default Compass;
