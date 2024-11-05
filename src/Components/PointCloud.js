import { useEffect, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import { Grid, PointCloud2, Viewer, ROS3D } from "ros3d";
import ROSLIB from "roslib";
import DeckGL, { PointCloudLayer } from "deck.gl";

const PointCloud = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
  const [exist, setExist] = useState(false);
  const topicName = "/nature/points";
  var layers;

  useEffect(() => {
    // ros.getTopicType(
    //   topicName,
    //   (type) => {
    //     console.log(type);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    if (
      isCon &&
      // !exist &&
      // document.getElementById("viewer") != null &&
      topicName in topicSubDataRef.current
    ) {
      //console.log(topicSubDataRef.current[topicName].message);
      //console.log("Here");
      layers = new PointCloudLayer({
        id: "PointCloudLayer",
        data: parsePointCloud2Data(topicSubDataRef.current[topicName].message),
        getPosition: (d) => {
          d.position;
        },
        getColor: (d) => d.color,
        pointSize: 1,
        coordinateOrigin: [-122.4, 37.74],
        pickable: true,
      });
      //console.log(document.getElementById("viewer"));
      //setExist(true);
      // var viewer = new Viewer({
      //   divID: "viewer",
      //   width: 800,
      //   height: 600,
      //   antialias: true,
      // });
      // var tfClient = new ROSLIB.TFClient({
      //   ros: ros,
      //   angularThres: 0.01,
      //   transThres: 0.01,
      //   rate: 10.0,
      // });
      // var pointCloud = new PointCloud2({
      //   ros: ros,
      //   topic: topicName,
      //   tfClient: tfClient,
      //   rootObject: viewer.scene,
      //   material: { size: 1000, color: 0xffffff },
      //   max_pts: 10000,
      //   points: "test",
      // });
      // viewer.addObject(pointCloud);
      // pointCloud.processMessage(topicSubDataRef.current[topicName].message);
      // //viewer.addObject();
      // viewer.addObject(new Grid());
    }
  }, [ros, isCon, refresh]);
  return (
    // <div className="card">
    //   <h3 className="card-title"> Lidar </h3>
    //   <div id="viewer"></div>
    // </div>
    <div className="card">
      <DeckGL
        initialViewState={{
          longitude: -122.45,
          latitude: 37.78,
          zoom: 11,
        }}
        controller
        //getTooltip={({object}: PickingInfo<DataType>) => object && object.position.join(', ')}
        layers={[layers]}
        //style={{ backgroundColor: "black" }} // Set background color to black
      />
    </div>
  );
};
function parsePointCloud2Data(message) {
  const { height, width, point_step, data, fields } = message;
  const points = [];
  const convertData = base64ToUint8Array(data);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const pointIndex = (row * width + col) * point_step;
      const point = {};

      fields.forEach((field) => {
        const { name, offset, datatype } = field;
        const byteOffset = pointIndex + offset;
        // Conversion based on datatype
        if (datatype === 7) {
          // Assuming 7 is float32 (x, y, z)
          point[name] = new Float32Array(
            convertData.slice(byteOffset, byteOffset + 4)
          )[0];
          //console.log(point[name]);
        }
        // Add other datatype conversions if needed
      });
      //console.log(point);
      points.push({
        position: [point.x, point.y, point.z],
        color: [0, 0, point.intensity],
      });
      //console.log(points);
    }
  }
  //console.log(points);
  return points;
}
function base64ToUint8Array(base64) {
  var raw = atob(base64);
  var uint8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}
export default PointCloud;
