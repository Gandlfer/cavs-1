import "../index.css";
import { IconContext } from "react-icons";
import * as Io5 from "react-icons/io5";
import TestComponent from "./TestComponent";
import ControllerButton from "./ControllerButtons";
import { useRos } from "../Utils/RosConnProvider";
import ROSLIB from "roslib";

export default function Header() {
  const { ros, isCon, refresh } = useRos();

  const rosParam = new ROSLIB.Param({
    ros: ros,
    name: "/global_path_node/shutdown_behavior",
  });
  const buttonPress = () => {
    rosParam.get((value) => {
      console.log(value);
    });
  };
  return (
    <header className="header">
      <h1>CAVS</h1>
      <div className="controller">
        {/* {/* <button className="ctrl-button" >
              <Io5.IoPlay onClick={buttonPress}/>
            </button> 
        <ControllerButton />
        <button className="ctrl-button">
          <Io5.IoPause />
        </button> */}
        <button className="ctrl-button">
          <Io5.IoPower />
        </button>
      </div>
    </header>
  );
}
