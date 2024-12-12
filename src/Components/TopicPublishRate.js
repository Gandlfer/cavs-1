import { useState, useEffect, useRef } from "react";
import { useRos } from "../Utils/RosConnProvider.js";

const TopicPublishRate = () => {
  const { ros, isCon, topicSubDataRef, refresh } = useRos();
  const [topics, setTopics] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const draggedIndex = useRef(null);

  useEffect(() => {
    if (ros && isCon) {
      const intervalId = setInterval(() => {
        // Trigger updates periodically
        setUpdateTrigger((prev) => prev + 1);
      }, 1000); // Update every second (adjust interval as needed)
      
      //Disposal on unmmount
      return () => clearInterval(intervalId);
    }
  }, [ros, isCon]);

  useEffect(() => {
    const topicNames = Object.keys(topicSubDataRef.current);
    setTopics((prevTopics) => {
      // Create a new list with topics from prevTopics and new topics added
      const updatedTopics = [...prevTopics];
      const newTopics = topicNames.filter((name) => !prevTopics.includes(name));
      updatedTopics.push(...newTopics); // Add new topics while preserving order
      return updatedTopics.filter((topic) => topicNames.includes(topic)); // Remove stale topics
    });
  }, [refresh, updateTrigger]);

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
        ? topics.map((topic, index) => {
            const topicData = topicSubDataRef.current[topic];
            return (
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

                <div
                  className="topic-color"
                  id={topicData && topicData.pubRate > 0 ? "green" : "red"}
                >
                  {topicData ? topicData.pubRate || 0 : 0}
                </div>
              </li>
            );
          })
        : null}
    </div>
  );
};
export default TopicPublishRate;
