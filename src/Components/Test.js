import React, { useState, useEffect } from "react";
import ROSLIB from "roslib";

const Test = (props) => {
  const [data, setData] = useState(0);
  useEffect(() => {
    let topicType;
    //Function to get the topic type
    props.ros.getTopicType(
      "/client_count",
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
      name: "/client_count",
      messageType: topicType,
    });
    //subscribe to the topic and update the data
    testTopic.subscribe((message) => {
      setData(message.data);
    });

    return () => {
      testTopic.unsubscribe();
    };
  }, []);

  return <div>{data}</div>;
};

export default Test;
