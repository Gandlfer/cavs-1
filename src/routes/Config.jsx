import React, { useEffect, useState } from "react";
import ConfigData from "../PlaceholderFiles/ConfigData";
import ConfigTopicAvailable from "../Components/ConfigTopicAvailable";
import { useRos } from "../Utils/RosConnProvider";
import * as Io5 from "react-icons/io5";
import toast from "react-hot-toast";
import TopicPublishRate from "../Components/TopicPublishRate";

export default function Config() {
  const { defaultURLRef, resubscribeToTopics, isCon, reconnectRos } =
    useRos();
  const [config, setConfig] = useState(
    localStorage.getItem("ConfigData")
      ? JSON.parse(localStorage.getItem("ConfigData"))
      : ConfigData
  );
  const notify = () => {toast.success("Path Saved")};

  // Handle input changes
  const handleInputChange = (index, newPath) => {
    const updatedConfig = [...config];
    updatedConfig[index].path = newPath;
    setConfig(updatedConfig);
  };

  // Save data
  const handleSave = () => {
    // Here you can send the `config` state to your backend or update the file
    if (isCon) {
      localStorage.setItem("ConfigData", JSON.stringify(config));
      resubscribeToTopics(
        config.reduce((acc, obj) => {
          acc[obj.name] = obj.path;
          return acc;
        }, {})
      );
      
        notify();
      
    }
  };

  const handleSaveServer = () => {
    const newUrl = document.getElementById("server-path").value;
    if (newUrl.replace("ws://", "") != defaultURLRef.current) {
      //Reconnect to ROS using the new WebSocket URL
      reconnectRos(newUrl.replace("ws://", "")); 
        notify();
    }
  };

  return (

    <div id="config-container" className="body">
      <div id="server-box" className="status-card">
        <span id="server-name" className="topic-name">
          Server Address:
        </span>
        <span id="path-prefix" className="topic-name">
          ws://
        </span>
        <input
          id="server-path"
          className="topic-path"
          label="Server Address"
          defaultValue={defaultURLRef.current}
        />
        <button
          id="save-server-button"
          className="ctrl-button"
          onClick={handleSaveServer}
        >
          <Io5.IoSaveOutline />
        </button>
      </div>
      <div className="status-card">
        <h3 className="card-title">Components</h3>
        <div className="config-components">
          <ul>
            {config.map((val, key) => {
              return (
                <li key={key} className="topic">
                  <span className="topic-name" id={"light"}>
                    {val.name}
                  </span>
                  <input
                    className="topic-path"
                    defaultValue={val.path}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <button id="save-config" onClick={handleSave}>
          Save
        </button>
      </div>
      <ConfigTopicAvailable />
      <div id="topics-container" className="status-card">
      <h3 className="card-title">Topics</h3>
      <div className="topic-list">
        {isCon? <TopicPublishRate/> : "No websocket Connection"}
        
      </div>
      </div>
    </div>
  );
}
