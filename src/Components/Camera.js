import React, {
  useState,
  useEffect,
  createElement,
  useRef,
  useMemo,
} from "react";
import "../index.css";
import ROSLIB from "roslib";

const Camera = (props) => {
  var canvasRef = useRef(null);
  var temp = false;
  const name = "/mavs_ros/image";
  const [message, setMessage] = useState(0);
  //const [subbed, setSubbed] = useState(false);
  //const [messageCount, setMessageCount] = useState(0);
  const messageCountRef = useRef(0);
  const intervalRef = useRef(Date.now());
  const prevTimeStamp = useRef(0);
  const pubRateRef = useRef(0);
  const [pubRate, setPubRate] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(0);
  const [cameraWidth, setCameraWidth] = useState(0);
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
  // const subFunction = useMemo(() => {
  //   testTopic.subscribe((message) => {
  //     setMessage(message);
  //     drawCanvas(message, canvasRef);
  //     setCameraHeight(message.height);
  //     setCameraWidth(message.width);
  //   });
  // });
  // if (!subbed) {
  //   testTopic.subscribe((message) => {
  //     setSubbed(true);
  //     //setMessage(message);
  //     setMessageCount(messageCount + 1);
  //     console.log(messageCount);
  //     drawCanvas(message, canvasRef);
  //     setCameraHeight(message.height);
  //     setCameraWidth(message.width);
  //   });
  // }
  // testTopic.subscribe((message) => {
  //   setMessage(message);
  //   setMessageCount(messageCount + 1);
  //   //   //   setMessageCount(messageCount + 1);
  //   //   //   //setMessage(message);
  //   //   //   // setMessageCount(messageCount + 1);
  //   //   //   // console.log(messageCount);
  //   drawCanvas(message, canvasRef);
  //   setCameraHeight(message.height);
  //   setCameraWidth(message.width);
  // });

  useEffect(() => {
    //console.log(messageCount);
    // if (message != 0) {
    //   console.log(messageCount);
    //   //setMessageCount(messageCount + 1);
    //   drawCanvas(message, canvasRef);
    //   // setCameraHeight(message.height);
    //   // setCameraWidth(message.width);
    // }

    // have the pubrate number change less frequently
    testTopic.subscribe((message) => {
      messageCountRef.current += 1;
      //const startTime = Date.now();
      //console.log(message);
      if (prevTimeStamp.current != 0) {
        pubRateRef.current = Math.ceil(
          1 / ((Date.now() - prevTimeStamp.current) / 1000)
        );
        //setPubRate(1 / ((Date.now() - prevTimeStamp.current) / 1000));
        console.log(pubRateRef.current);
      }
      prevTimeStamp.current = Date.now();
      intervalRef.current = Date.now();
      //console.log(pubRate);
      // intervalRef.current = setInterval(() => {
      //   const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
      //   const rate = messageCountRef.current / elapsedTime;
      //   console.log(rate);
      //   // //console.log(elapsedTime);
      //   // if (elapsedTime > 0) {
      //   //   setPubRate(messageCountRef.current / elapsedTime); // messages per second
      //   //   console.log(messageCountRef.current / elapsedTime);
      //   //   console.log(elapsedTime);
      //   // }
      // }, 1000); // update every second
      setMessage(message);
      drawCanvas(message, canvasRef);
      setCameraHeight(message.height);
      setCameraWidth(message.width);
    });

    //subscribe to the topic and update the data
    // if (!temp) {
    //   testTopic.subscribe((message) => {
    //     setMessage(message);

    //     setMessageCount(messageCount + 1);
    //     // drawCanvas(message, canvasRef);
    //     // setCameraHeight(message.height);
    //     // setCameraWidth(message.width);

    //     temp = true;
    //   });
    // }

    // if (message != 0) {
    //   drawCanvas(message, canvasRef);
    //   setCameraHeight(message.height);
    //   setCameraWidth(message.width);
    // }

    return () => {
      testTopic.unsubscribe();
    };
  }, []);

  return (
    <div className="card">
      <p>{pubRateRef.current}</p>
      <canvas
        className="card-img"
        ref={canvasRef}
        height={cameraHeight}
        width={cameraWidth}
      />
      {/* <img className="card-img" src={pic} alt="camera topic"></img>
      <h2 className="card-name">Card</h2> */}
      <p>Camera from MAVS</p>
    </div>
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

function drawCanvas(message, canvasRef) {
  var byteArray = base64ToUint8Array(message.data);
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
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
}
