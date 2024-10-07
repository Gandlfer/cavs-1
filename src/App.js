import logo from "./logo.svg";
import "./App.css";
import ROSLIB from "roslib";
import React, { useState, useEffect } from "react";
import RosConnection from "./RosConnection";
import Test from "./Components/Test";

let ros = null;

function App() {
  const [loading, setLoading] = useState(true);
  const [rosConn, setRosConn] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function connection() {
      try {
        setLoading(true);
        ros = new ROSLIB.Ros({
          url: "ws://localhost:9090",
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
    connection();
    return () => {
      if (ros != null) {
        ros.close();
      }
    };
  }, [ros]);
  if (!loading && ros != null) {
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
          {rosConn ? "Connected to Ros" : loading ? "Trying to Connect" : error}
        </p>
        {
          rosConn ? <Test ros={ros} /> : null //<Test ros={rosState}/> : null
        }
      </header>
    </div>
  );
}

export default App;
