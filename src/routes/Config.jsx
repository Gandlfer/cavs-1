import React from "react";
import ConfigData from "../PlaceholderFiles/ConfigData";
import ConfigTopicAvailable from "../Components/ConfigTopicAvailable";
import * as Io5 from "react-icons/io5";

export default function Config() {
  return (
    <div id="config-container" className="body">
      <div id="server-box" className="status-card">
        <span id="server-name" className="topic-name">
          Server Address
        </span>
        <input
          id="server-path"
          className="topic-path"
          label="Server Address"
          defaultValue={"Server path"}
        />
        <button id="save-server-button" className="ctrl-button">
          <Io5.IoSaveOutline />
        </button>
      </div>
      <div className="status-card">
        <h3 className="card-title">Components</h3>
        <div className="config-components">
          <ul>
            {ConfigData.map((val, key) => {
              return (
                <li key={key} className="topic">
                  <span className="topic-name" id={"light"}>
                    {val.name}
                  </span>
                  <input className="topic-path" defaultValue={val.path} />
                </li>
              );
            })}
          </ul>
        </div>
        <button id="save-config">Save</button>
      </div>
      <ConfigTopicAvailable />
    </div>
  );
}
