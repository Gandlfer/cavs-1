import React from "react";
import ConfigData from "../PlaceholderFiles/ConfigData";

export default function Config() {
  return (
    <div id="config-container" className="body">
      <div className="status-card">
        <h3 className="card-title">Components</h3>
        <ul>
          {ConfigData.map((val, key) => {
            return (
              <li key={key} className="topic">
                <span
                  className="topic-name"
                  id={key % 2 == 0 ? "light" : "light"}
                >
                  {val.name}
                </span>
                <input className="topic-path" defaultValue={val.path} />
              </li>
            );
          })}
        </ul>
        <button id="save-config">Save</button>
      </div>
      <div className="status-card">
        <h3 className="card-title">Topics Available</h3>
        <ul>
          {ConfigData.map((val, key) => {
            return (
              <li key={key} className="topic">
                <span
                  className="topic-name"
                  id={key % 2 == 0 ? "light" : "light"}
                >
                  {val.path}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
