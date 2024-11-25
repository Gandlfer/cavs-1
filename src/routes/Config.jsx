import React from "react";
import ConfigData from "../PlaceholderFiles/ConfigData";
import ConfigTopicAvailable from "../Components/ConfigTopicAvailable";

export default function Config() {
  return (
    <div id="config-container" className="body">
      <div id="server-box" className="status-card">
        <p className="topic-name"> Server Address</p>
        <input
          id="server-text"
          className="topic-path"
          label="Server Address"
          defaultValue={"Server address path"}
        />
      </div>
      <div className="status-card">
        <h3 className="card-title">Components</h3>
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
        <button id="save-config">Save</button>
      </div>
      <ConfigTopicAvailable/>
    </div>
  );
}
