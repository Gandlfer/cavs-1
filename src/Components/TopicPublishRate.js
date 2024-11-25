import ROSLIB from "roslib";
import { useState, useEffect, useRef } from "react";
import { useRos } from "../Utils/RosConnProvider.js";

const TopicPublishRate = () => {
  const { ros, isCon, topicSubDataRef, refresh } = useRos();
  const [topics, setTopics] = useState([]);
  const draggedIndex = useRef(null);

  useEffect(() => {}, [ros, isCon]);
  useEffect(() => {
    const topicNames = Object.keys(topicSubDataRef.current);
    setTopics((prevTopics) => {
      const newTopics = topicNames.filter((name) => !prevTopics.includes(name));
      return [...prevTopics, ...newTopics];
    });
  }, [refresh]);

  const handleDragStart = (index) => {
    draggedIndex.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex.current !== null) {
      const updatedTopics = [...topics];
      const [draggedItem] = updatedTopics.splice(draggedIndex.current, 1);
      updatedTopics.splice(index, 0, draggedItem);
      setTopics(updatedTopics);
      draggedIndex.current = null;
    }
  };

  return (
    <div>
      {topics.length > 0
        ? topics.map((topic, index) => (
            <li
              key={topic}
              className="topic"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <span
                className="topic-name"
                id={index % 2 == 0 ? "light" : "dark"}
              >
                {topic}
              </span>
              {/* {console.log(topicSubDataRef.current[topic].message)} */}
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
export default TopicPublishRate;
