import React, { useEffect, useRef, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import IMU_Ang from "./IMU-Angular.js";
import IMU_Pos from "./IMU-Position.js";

const IMU = () => {
  const { ros, isCon, refresh, topicSubDataRef, subscribedTopics } = useRos();
  const [gotDataOd, setGDOd] = useState(false);
  const [gotDataIMU, setGDIMU] = useState(false);

  useEffect(() => {
    //Check Odometry
    setGDOd("Odometry" in subscribedTopics.current &&
      subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
      "message" in topicSubDataRef.current[subscribedTopics.current["Odometry"].path]);
    
    //Check IMU
    setGDIMU("IMU" in subscribedTopics.current &&
      subscribedTopics.current["IMU"].path in topicSubDataRef.current &&
      "message" in topicSubDataRef.current[subscribedTopics.current["IMU"].path]);
    
  }, [[ros, isCon, refresh]]);

  if(gotDataOd && gotDataIMU){
    return (
      <div className="card-IMU" id="IMU-card">
        <h3 className="card-title"> IMU </h3>
        <div className="IMU-container">
          <IMU_Ang/> <IMU_Pos/>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card-IMU" id="IMU-card">
        <h3 className="card-title-warn"> IMU {gotDataOd? "" : "| No Odometry"} {gotDataIMU? "" : "| No IMU"}</h3>
        <IMU_Ang/> <IMU_Pos/>
      </div>
    );
  }
  
};
export default IMU;
