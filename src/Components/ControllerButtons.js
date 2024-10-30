import { useEffect } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import * as Io5 from "react-icons/io5";

const ControllerButton = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
  const topicName = "/nature/state";
  useEffect(() => {});
  return (
    <button className="ctrl-button">
      <Io5.IoPlay onClick={buttonPress} />
    </button>
  );
};

export default ControllerButton;
