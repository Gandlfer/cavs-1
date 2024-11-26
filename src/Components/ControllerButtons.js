import { useEffect, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import * as Io5 from "react-icons/io5";
import ROSLIB from "roslib";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const ControllerButton = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
  const [update, setUpdate] = useState(false);
  const topicName = "/nature/state";
  const buttonHandler = () => {
    if (topicName in topicSubDataRef.current && isCon) {
      console.log(topicSubDataRef.current[topicName].message);
      const rosParam = new ROSLIB.Param({
        ros: ros,
        name: "/global_path_node/shutdown_behavior",
      });
      rosParam.get((value) => {
        console.log(value);
      });
      toast.success("Playing");
    } else {
      console.log("Data not ready");
      toast.error("Data is not ready");
    }
  };
  useEffect(() => {
    // console.log("Controller Refresh");
    // if (topicName == topicSubDataRef.current) {
    //   console.log(topicSubDataRef.current[topicName].message);
    // }
    // const rosParam = new ROSLIB.Param({
    //     ros: ros,
    //     name: '/global_path_node/shutdown_behavior'
    // })
  }, [ros, isCon, refresh]);

  return (
    <div>
      <button className="ctrl-button">
        <Io5.IoPlay onClick={buttonHandler} />
      </button>
      <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
    </div>
  );
};

export default ControllerButton;
// avt_341/state (std_msgs/Int32) The current simulation state, which can be -1, 0, 1, 2, 3
// -1: Idling in startup state - no waypoints loaded or recieved
// 0: Active - following waypoint path
// 1: Idling in end state - bring vehicle to a smooth stop after reaching the final waypoint in the current path
// 2: Shutting down - ROS network exits after bringing to a smooth shutdown
// 3: Emergency shutdown - sends braking message and shuts down.

// ~shutdown_behavior (int, default: 1) Indicates the desired behavior when the vehicle reaches its final goal point. The value can be 1, 2, or 3.
// 1: Bring to a smooth stop but do not shut down
// 2: Bring to a smooth stop and shut down
// 3: ring to an immediate stop (hard braking) and shut down
