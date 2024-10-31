import { polyline1 } from "../PlaceholderFiles/MapData.jsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  SVGOverlay,
} from "react-leaflet";
import { useRos } from "../Utils/RosConnProvider.js";
import { useEffect, useState } from "react";

const MapComponent = () => {
  const localPathTopicName = "/nature/local_path";
  const globalPathTopicName = "/nature/global_path";
  const testTopicName = "/nature/odometry";
  const [globalPath, setGlobalPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const { ros, isCon, topicSubDataRef, refresh } = useRos();
  const getDataArray = (arr) => {
    let dataArray = [];
    //console.log(arr);
    arr.forEach((obj) => {
      dataArray.push([obj.pose.position.x, obj.pose.position.y]);
    });
    return dataArray;
  };
  useEffect(() => {
    if (
      localPathTopicName in topicSubDataRef.current &&
      globalPathTopicName in topicSubDataRef.current
    ) {
      // console.log("Local path");
      // console.log(topicSubDataRef.current[localPath]);
      // console.log("Global path");
      //console.log(topicSubDataRef.current[globalPathTopicName].message);

      setGlobalPath(
        getDataArray(topicSubDataRef.current[globalPathTopicName].message.poses)
      );
    }
    if (testTopicName in topicSubDataRef.current) {
      console.log(
        topicSubDataRef.current[testTopicName].message.pose.pose.position
      );
      setCurrentPosition([
        topicSubDataRef.current[testTopicName].message.pose.pose.position.x,
        topicSubDataRef.current[testTopicName].message.pose.pose.position.y,
      ]);
    }
  }, [ros, isCon, refresh]);
  return (
    <>
      {console.log("Update")}
      {isCon ? (
        <MapContainer
          center={[33.453892, -88.788887]}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition}>
            <Popup>Current Moving Vehicle Placeholder marker</Popup>
          </Marker>
          <Polyline pathOption={{ color: "red" }} positions={globalPath} />
        </MapContainer>
      ) : (
        <MapContainer
          center={[33.453892, -88.788887]}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[33.453892, -88.788887]}>
            <Popup>
              Start point <br /> Mississippi State University
            </Popup>
          </Marker>
          <Marker position={[33.452, -88.7884]}>
            <Popup>
              Destination <br /> Mississippi State University
            </Popup>
          </Marker>
          <Polyline pathOption={{ color: "red" }} positions={polyline1} />
        </MapContainer>
      )}
    </>
  );
};
export default MapComponent;
