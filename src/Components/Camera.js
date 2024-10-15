import React, { useState, useEffect, createElement, useRef } from "react";
import ROSLIB from "roslib";

const Camera = (props) => {
  const canvasRef = useRef(null);
  const name = "/mavs_ros/image";
  const [data, setData] = useState(0);
  const [data2, setData2] = useState(0);
  useEffect(() => {
    let topicType;
    //Function to get the topic type
    props.ros.getTopicType(
      name,
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
      name: name,
      messageType: topicType,
    });
    //subscribe to the topic and update the data
    testTopic.subscribe((message) => {
      console.log(message);
      var byteArray = base64ToUint8Array(message.data);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.width = message.width;
      context.height = message.height;
      var imageData = context.createImageData(message.width, message.height);
      var data = imageData.data;

      for (var i = 0; i < byteArray.length; i += 3) {
        var canvasIndex = (i / 3) * 4;
        data[canvasIndex] = byteArray[i]; // Red
        data[canvasIndex + 1] = byteArray[i + 1]; // Green
        data[canvasIndex + 2] = byteArray[i + 2]; // Blue
        data[canvasIndex + 3] = 255; // Alpha, fully opaque
      }

      context.putImageData(imageData, 0, 0);

      //console.log(message.data);

      //setData(message.data);
    });

    return () => {
      testTopic.unsubscribe();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{}} />

    // <div>
    //   {createElement("image")}
    //   <img
    //     src={`data:image/png;base64,${data}`}
    //     alt={"Ros Image"}
    //     style={{ width: 384, height: 256 }}
    //   />
    // </div>
  );
};

//Function to convert Base64 string to byte array
function base64ToUint8Array(base64) {
  var raw = atob(base64);
  var uint8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}
export default Camera;
