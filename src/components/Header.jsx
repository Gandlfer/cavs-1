import "../index.css";
import { IconContext } from "react-icons";
import * as Io5 from "react-icons/io5";
import ControllerButton from "./ControllerButtons";
import { useRos } from "../Utils/RosConnProvider";
import ROSLIB from "roslib";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

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
  const submit = () => {
    confirmAlert({
      title: "Confirm Shutdown",
      message: "Are you sure to shutdown the vehicle? (It has been paused.)",
      buttons: [
        {
          label: "Shutdown",
          //onClick: () => alert("Click No"),
        },
        {
          label: "Resume",
          //onClick: () => alert("Exiting"),
        },
      ],
    });
  };
  return (
    <header className="header">
      <h1>CAVS</h1>
      <div className="controller">
          <button className="ctrl-button" onClick={submit} title="Shutdown Vehicle">
          <Io5.IoPower />
        </button>
      </div>
    </header>
  );
}
