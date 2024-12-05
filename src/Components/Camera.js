import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useRos } from "../Utils/RosConnProvider.js";

const Camera = () => {
  const { ros, isCon, topicSubDataRef, refresh, subscribedTopics } = useRos();
  var canvasRef = useRef(null);

  const [cameraHeight, setCameraHeight] = useState(0);
  const [cameraWidth, setCameraWidth] = useState(0);
  const [messageTest, setMessageTest] = useState({});

  useEffect(() => {
    if (
      "Camera 1" in subscribedTopics.current &&
      subscribedTopics.current["Camera 1"].path in topicSubDataRef.current
    ) {
      setMessageTest(
        topicSubDataRef.current[subscribedTopics.current["Camera 1"].path]
          .message
      );
      if (Object.keys(messageTest).length > 0) {
        drawCanvas(messageTest, canvasRef);
        setCameraHeight(messageTest.height);
        setCameraWidth(messageTest.width);
      }
    }
  }, [ros, isCon, refresh]);

  return (
    <div className="card">
      <h3 className="card-title">
        {" "}
        Camera from {subscribedTopics.current["Camera 1"].path}{" "}
      </h3>
      <canvas
        className="card-img"
        ref={canvasRef}
        height={cameraHeight}
        width={cameraWidth}
      />
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

export default Camera;
