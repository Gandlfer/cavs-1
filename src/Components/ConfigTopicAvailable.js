import { useState, createContext, useContext, useEffect, useRef } from "react";
import ROSLIB from "roslib";
import { useRos } from "../Utils/RosConnProvider.js";
import ConfigData from "../PlaceholderFiles/ConfigData.jsx";

const ConfigTopicAvailable = () => {
  const { ros, isCon, availableTopicsRefresh } = useRos();

  useEffect(() => {}, [ros]);

  return (
    <div className="status-card" id="config-available-card">
      <h3 className="card-title">Topics Available</h3>
      <ul id="config-available">
        {isCon && availableTopicsRefresh.length > 0
          ? availableTopicsRefresh.map((element) => {
              return (
                <li key={element} className="topic">
                  <span className="topic-name" id={"light"}>
                    {element}
                  </span>
                </li>
              );
            })
          : ConfigData.map((element) => {
              return (
                <li key={element.name} className="topic">
                  <span className="topic-name" id="light">
                    {element.path}
                  </span>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default ConfigTopicAvailable;
