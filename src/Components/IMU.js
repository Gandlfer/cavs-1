import React, { useState, useEffect } from "react";
import ROSLIB from "roslib";

const IMU = (props) => {
  const name = "/nature/points";
  const [data, setData] = useState(0);
  useEffect(() => {
    let topicType;
    //Function to get the topic type
    props.ros.getTopicType(
      name,
      (type) => {
        console.log(name + " is type ");
        console.log(type);
        topicType = type;
      },
      (error) => {
        console.log(error);
      }
    );
    //Initialize a topic to subscribe to
    const testTopic = new ROSLIB.Topic({
      ros: props.ros,
      name: name,
      messageType: topicType,
    });
    //subscribe to the topic and update the data
    testTopic.subscribe((message) => {
      console.log(message);
      setData(message.height);
    });

    return () => {
      testTopic.unsubscribe();
    };
  }, []);

  return (
    <div>
      <p>Current</p>
      {data}
    </div>
  );
};

export default IMU;
