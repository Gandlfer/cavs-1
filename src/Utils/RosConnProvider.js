import { useState, createContext, useContext, useEffect, useRef } from "react";
import ROSLIB from "roslib";

const RosContext = createContext();

export const useRos = () => {
  return useContext(RosContext);
};

export const RosProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isCon, setIsCon] = useState(false);
  const [error, setError] = useState(null);
  const [ros, setRos] = useState(null);
  const rosRef = useRef();
  let rosConn;
  useEffect(() => {
    function connection() {
      setLoading(true);
      rosConn = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });
      setRos(rosConn);
      setLoading(false);
    }
    connection();
    return () => {
      if (ros != null) {
        ros.close();
      }
    };
  }, []);
  if (ros != null) {
    ros.on("error", function (error) {
      console.log("Connection Error" + error);
      setIsCon(false);
    });
    ros.on("connection", function () {
      console.log("Connection made!");
      setIsCon(true);
      //console.log(ros);
    });
    ros.on("close", () => {
      console.log("Connection Close!");
      setIsCon(false);
    });
  }
  return (
    <RosContext.Provider value={{ ros, isCon }}>{children}</RosContext.Provider>
    // <div>
    //   <p>
    //     {loading ? "Trying to Connect" : null}
    //     {rosConn ? "Connected to Ros" : "Disconnected"}
    //   </p>
    //   {rosConn ? <Camera ros={ros} /> : null}
    //   {/* {rosConn ? <Test ros={ros} /> : null}
    //     {rosConn ? <IMU ros={ros} /> : null} */}
    // </div>
  );
};
