import "../index.css";
import * as Io5 from "react-icons/io5";
import ControllerButton from "./ControllerButtons";
import { useRos } from "../Utils/RosConnProvider";
import ROSLIB from "roslib";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";

export default function Header() {
  const { ros, isCon, refresh } = useRos();

  const rosParam = new ROSLIB.Param({
    ros: ros,
    name: "/global_path_node/shutdown_behavior",
  });

  const notify = (message) => toast.success(message);
  
  const submit = () => {
    confirmAlert({
      title: "Confirm Shutdown",
      message: "Are you sure to shutdown the vehicle? (It has been paused.)",
      buttons: [
        {
          label: "Shutdown",
          onClick: () => notify("Shutdown command sent!")
        },
        {
          label: "Resume",
          onClick: () => notify("Playing")
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
