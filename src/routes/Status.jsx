import React, { useEffect, useRef, useState } from "react";
import Card from "../Components/Card";
import TopicPublishRate from "../Components/TopicPublishRate";
//import TopicData from "../PlaceholderFiles/TopicData";
import { useRos } from "../Utils/RosConnProvider";
import TopicData from "../PlaceholderFiles/TopicData.json";

export default function Status() {
  const { isCon } = useRos();
  const dragElement = useRef(0);
  const draggedOver = useRef(0);

  const [topics, setTopics] = useState(JSON.stringify(TopicData));

  function handleSort() {
    const clone = TopicData;
    const temp = clone[dragElement.current];
    clone[dragElement.current] = clone[draggedOver.current];
    clone[draggedOver.current] = temp;
    setTopics(JSON.stringify(clone));

    fetch("../PlaceholderFiles/TopicData.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clone, null, 2),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  }

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
            {TopicData.map((val, index) => {
              return (
                <li index={index} className="topic">
                  <span
                    className="topic-name"
                    id={index % 2 == 0 ? "light" : "dark"}
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
              {TopicData.map((val, index) => {
                return (
                  <div
                    className="topicElement"
                    draggable
                    onDragStart={() => (dragElement.current = index)}
                    onDragEnter={() => (draggedOver.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <p className="topic">
                      <span
                        className="topic-name"
                        id={index % 2 == 0 ? "light" : "dark"}
                      >
                        {val.title}
                      </span>
                      <div
                        className="topic-color"
                        id={val.status ? "green" : "red"}
                      >
                        {val.status}
                        {/*publishRate here or modifying the above id condition*/}
                      </div>
                    </p>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
