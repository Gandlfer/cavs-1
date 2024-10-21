import React, { useState, useEffect } from "react";
import ROSLIB from "roslib";

// for rendering occupancy grid use https://webviz.io/worldview/#/docs/tutorial/rendering-objects
const Test = (props) => {
  const [data, setData] = useState(0);
  const topicName = "/nature/global_path";
  useEffect(() => {
    let topicType;
    //Function to get the topic type
    props.ros.getTopicType(
      topicName,
      (type) => {
        topicType = type;
      },
      (error) => {
        console.log(error);
      }
    );
    //Initialize a topic to subscribe to
    const testTopic = new ROSLIB.Topic({
      ros: props.ros,
      name: topicName,
      messageType: topicType,
    });
    //subscribe to the topic and update the data
    testTopic.subscribe((message) => {
      setData(message.data);
      console.log(message.data);
    });

    return () => {
      testTopic.unsubscribe();
    };
  }, []);

  return <div>{data}</div>;
};

export default Test;
