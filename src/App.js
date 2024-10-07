import logo from "./logo.svg";
import "./App.css";
import ROSLIB from "roslib";
import React, { useState, useEffect } from "react";
import RosConnection from "./RosConnection";
import Test from "./Components/Test";

let ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

function App() {
  //const [rosState, setRosState] = useState(ros);
  const [rosConn, setRosConn] = useState(false);
  useEffect(() => {
    ros.on("error", function (error) {
      console.log("Connection Error" + error);
      setRosConn(false);
      //setRosState(null);
    });
    ros.on("connection", function () {
      console.log("Connection made!");
      setRosConn(true);
      //setRosState(ros);
    });
    ros.on("close", () => {
      console.log("Connection Close!");
      setRosConn(false);
      //setRosState(null);
    });
    return () => {
      ros.close();
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{rosConn ? "Connected" : "Not Connected"}</p>
        {
          rosConn ? <Test ros={ros} /> : null //<Test ros={rosState}/> : null
        }
      </header>
    </div>
  );
}

export default App;
