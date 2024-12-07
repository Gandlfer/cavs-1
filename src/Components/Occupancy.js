import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useRos } from "../Utils/RosConnProvider.js";

const Occupancy = () => {
  const { ros, isCon, topicSubDataRef, refresh, subscribedTopics } = useRos();
  const canvasRef = useRef(null);

  const [cameraHeight, setCameraHeight] = useState(0);
  const [cameraWidth, setCameraWidth] = useState(0);

  useEffect(() => {
    if (
      "Occupancy Grid" in subscribedTopics.current &&
      subscribedTopics.current["Occupancy Grid"].path in topicSubDataRef.current
    ) {
      const message = topicSubDataRef.current[subscribedTopics.current["Occupancy Grid"].path].message;
      if (message && message.data) {
        let scaleFactor = 1; //Change to increase/decrease rendered camera canvas
        try {
          drawCanvas(message, canvasRef, scaleFactor);
          setCameraHeight(message.height * scaleFactor);
          setCameraWidth(message.width * scaleFactor);
        } catch (error) {
          setCameraHeight(-1);
          setCameraWidth(-1);
        }
        
      }
    }
  }, [ros, isCon, refresh]);

  //Function to convert Base64 string to byte array
  function base64ToUint8Array(base64) {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  //Drawing the image on canvas
function drawCanvas(message, canvasRef, scale) {
    const byteArray = base64ToUint8Array(message.data);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    //Resize canvas based on the scale factor
    canvas.width = message.width * scale;
    canvas.height = message.height * scale;
  
    const imageData = context.createImageData(message.width, message.height);
    const data = imageData.data;
  
    //Loop through the byte array and assign grayscale values to the image
    for (let i = 0; i < byteArray.length; i++) {
      const canvasIndex = i * 4; // Each pixel has 4 bytes (RGBA)
      const grayValue = byteArray[i]; // mono8 encoding means 1 byte per pixel (grayscale)
  
      data[canvasIndex] = grayValue; //Red 
      data[canvasIndex + 1] = grayValue; //Green 
      data[canvasIndex + 2] = grayValue; //Blue 
      data[canvasIndex + 3] = 255; //Alpha, fully opaque
    }
  
    // First rendering of image
    context.putImageData(imageData, 0, 0);
  
    // Rerender
    context.drawImage(canvas, 0, 0, message.width, message.height, 0, 0, canvas.width, canvas.height);
  }
  if(cameraHeight > 0 && cameraWidth > 0) {
    return (
      <div className="card">
        <h3 className="card-title"> Occupancy Grid </h3>
        <canvas className="card-img" ref={canvasRef} />
      </div>
    );
  } else {
    return (
      <div className="card">
        <h3 className="card-title-warn"> Occupancy Grid {(cameraHeight < 0)? "| Bad Data" : "| No Occupancy Grid"} </h3>
        <canvas className="card-img" ref={canvasRef} />
      </div>
    );
  }
};

export default Occupancy;
