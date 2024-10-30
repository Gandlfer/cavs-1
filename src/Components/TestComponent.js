import { useEffect } from "react";
import { useRos } from "../Utils/RosConnProvider.js";

const TestComponent = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
  useEffect(() => {
    if ("/nature/waypoints" in topicSubDataRef.current) {
      console.log(topicSubDataRef.current["/nature/waypoints"]);
    }
  });
  return <></>;
};
export default TestComponent;
