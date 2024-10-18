import React, { useEffect } from "react";
import Card from "../Components/Card";
import Camera from "../Components/Camera";
import { RosProvider, useRos } from "../Utils/RosConnProvider";


export default function Sensor() {
  const {ros,isCon} = useRos()

  return (
      <div id="sensor-tab" className="body">
      {isCon ? <Camera ros={ros}/> :<Card/>}  
      <Card />
      <Card />
      <Card />
    </div>
    
  );
}
