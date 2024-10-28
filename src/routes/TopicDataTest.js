import ROSLIB from "roslib";
import { useState, useEffect, useRef } from "react";
import { useRos } from "../Utils/RosConnProvider.js";

const TopicDataTest = () => {
  const { ros, isCon, topicSubDataRef, refresh } = useRos();
  useEffect(() => {}, [refresh, ros, isCon]);
  return (
    <div>
      {Object.keys(topicSubDataRef.current).length > 0
        ? Object.keys(topicSubDataRef.current).map((topic, index) => (
            <li key={topic} className="topic">
              <span
                className="topic-name"
                id={index % 2 == 0 ? "light" : "dark"}
              >
                {topic}
              </span>
              {console.log(topicSubDataRef.current[topic].message)}
              <div
                className="topic-color"
                id={
                  topicSubDataRef.current[topic].pubRate > 0 ? "green" : "red"
                }
              >
                {topicSubDataRef.current[topic].pubRate}
              </div>
            </li>
          ))
        : null}
    </div>
  );
};
export default TopicDataTest;
