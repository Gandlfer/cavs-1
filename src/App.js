import logo from "./logo.svg";
import "./App.css";
import ROSLIB from "roslib";
import React, { useState, useEffect } from "react";
import Camera from "./Components/Camera.js";
import Test from "./Components/Test.js";

let ros = null;

function App() {
  const [loading, setLoading] = useState(true);
  const [rosConn, setRosConn] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function connection() {
      setLoading(true);
      ros = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });
      setLoading(false);
    }
    connection();
    return () => {
      if (ros != null) {
        ros.close();
      }
    };
  }, [ros]);
  if (!loading && ros != null) {
    //console.log(ros);
    ros.on("error", function (error) {
      console.log("Connection Error" + error);
      setRosConn(false);
    });
    ros.on("connection", function () {
      console.log("Connection made!");
      setRosConn(true);
    });
    ros.on("close", () => {
      console.log("Connection Close!");
      setRosConn(false);
    });
  }
  return (
    <div>
      <p>
        {/* {loading ? "Trying to Connect" : null}
        {rosConn ? "Connected to Ros" : "Disconnected"} */}
      </p>
      {rosConn ? <Test ros={ros} /> : null}
      {/* {rosConn ? <Camera ros={ros} /> : null} */}
      {/* {rosConn ? <Test ros={ros} /> : null}
        {rosConn ? <IMU ros={ros} /> : null} */}
    </div>
  );
}

export default App;
