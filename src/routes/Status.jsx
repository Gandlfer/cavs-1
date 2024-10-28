import React from "react";
import Card from "../Components/Card";
import TopicPublishRate from "../Components/TopicPublishRate";
import TopicData from "../Placeholder data files/TopicData";
import { useRos } from "../Utils/RosConnProvider";

export default function Status() {
  const { isCon } = useRos();
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
          {/* {isCon? null : <ul>
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
            })} */}
          {isCon ? (
            <TopicPublishRate />
          ) : (
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
                    >
                      1.0
                      {/*publishRate here or modifying the above id condition*/}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
