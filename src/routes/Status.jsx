import React from "react";
import Card from "../Components/Card";
import { TopicData } from "./TopicData";

export default function Status() {
  return (
    <div id="status-tab" className="body">
      <div id="console" className="status-card">
        <h3 className="card-title">Console</h3>
      </div>
      <div id="ros-bag" className="status-card">
        <h3 className="card-title">Ros-Bag</h3>
      </div>
      <div id="topics-container" className="status-card">
        <h3 className="card-title">Topics</h3>
        <div className="topic-list">
          <ul>
            {TopicData.map((val, key) => {
              return (
                <li key={key} className="topic">
                  <span
                    className="topic-name"
                    id={key % 2 == 0 ? "light" : "dark"}
                  >
                    {val.title}
                  </span>
                  <div
                    className="topic-color"
                    id={val.status ? "green" : "red"}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
