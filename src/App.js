import logo from "./logo.svg";
import "./App.css";
import ROSLIB from "roslib";
import React, { useState, useEffect } from "react";
import RosConnection from "./RosConnection";
import Test from "./Components/Test";
import IMU from "./Components/IMU";

let ros = null;
let test;
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {loading ? "Trying to Connect" : null}
          {rosConn ? "Connected to Ros" : "Disconnected"}
        </p>
        {rosConn ? <IMU ros={ros} /> : null}
        {rosConn ? <Test ros={ros} /> : null}
      </header>
    </div>
  );
}

export default App;
