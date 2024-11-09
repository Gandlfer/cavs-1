import { useEffect, useRef, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import { Grid, PointCloud2, Viewer, ROS3D } from "ros3d";
import ROSLIB from "roslib";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const PointCloud = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
  const [exist, setExist] = useState(false);
  const topicName = "/nature/points";
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const pointCloudRef = useRef();
  const controlsRef = useRef(null);

  useEffect(() => {
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);
    cameraRef.current.position.set(0, 0, 500); // Move the camera to ensure the axes are visible
    cameraRef.current.lookAt(0, 0, 0);
    // Add Axes Helper to show x, y, z directions at origin
    const axesHelper = new THREE.AxesHelper(50); // Adjust size as needed
    sceneRef.current.add(axesHelper);

    // Add ambient light for visibility
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(light);

    // Orbit Controls setup
    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      controlsRef.current.enableDamping = true; // Smooth transitions
      controlsRef.current.dampingFactor = 0.25;
      controlsRef.current.screenSpacePanning = true; // Disable panning along the screen
    }
  }, []);

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update(); // Update controls
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();
  }, []);
  useEffect(() => {
    if (topicName in topicSubDataRef.current && isCon) {
      console.log(topicSubDataRef.current[topicName].message);
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];

      parsePointCloud2Data(topicSubDataRef.current[topicName].message).forEach(
        (point) => {
          const { position, color } = point;
          vertices.push(position.x, position.y, position.z);

          colors.push(color.r, color.g, color.b);
        }
      );
      // console.log(vertices);
      // console.log(colors);
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      // Material for the points
      const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
      });
      if (pointCloudRef.current) {
        sceneRef.current.remove(pointCloudRef.current);
      }
      const pointCloud = new THREE.Points(geometry, material);
      sceneRef.current.add(pointCloud);
      pointCloudRef.current = pointCloud;
    }
  }, [ros, isCon, refresh]);
  return (
    <div className="card">
      <h3 className="card-title"> Lidar </h3>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
function parsePointCloud2Data(message) {
  const { height, width, point_step, row_step, data, fields } = message;
  const points = [];
  const convertData = base64ToUint8Array(data);
  //console.log(convertData);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const pointIndex = row * row_step + col * point_step;
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
      // Normalize intensity to [0, 1] for color mapping
      const normalizedIntensity = (point.intensity || 0) / 255;
      const color = new THREE.Color();
      color.setHSL(normalizedIntensity, 1.0, 0.5); // Adjust hue based on intensity
      //console.log(point);
      points.push({
        position: { x: point.x, y: point.y, z: point.z },
        color: { r: color.r, g: color.g, b: color.b },
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
