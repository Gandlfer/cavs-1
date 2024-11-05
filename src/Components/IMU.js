import React, { useState, useEffect, useRef } from "react";
import ROSLIB from "roslib";
import * as THREE from "three";
import { useRos } from "../Utils/RosConnProvider.js";

const IMU = () => {
  const { ros, isCon, refresh, topicSubDataRef } = useRos();
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
  const cubeRef = useRef(null);
  const topicName = "/mavs_ros/imu";
  const [data, setData] = useState(0);
  useEffect(() => {
    //console.log(topicSubDataRef.current[topicName]);
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);
    cameraRef.current.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    sceneRef.current.add(cube);
    cubeRef.current = cube;

    return () => {};
  });
  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();
  }, []);
  useEffect(() => {
    if (isCon && topicName in topicSubDataRef.current && cubeRef.current) {
      console.log(topicSubDataRef.current[topicName].message);
      const { x, y, z, w } =
        topicSubDataRef.current[topicName].message.orientation; // Extract quaternion data from imuData
      const quaternion = new THREE.Quaternion(x, y, z, w);
      cubeRef.current.quaternion.copy(quaternion); // Apply orientation to the cube
    }
  }, [[ros, isCon, refresh]]);
  return (
    <div className="card" id="IMU-card">
      <h3 className="card-title"> IMU </h3>
      <div ref={mountRef} />
    </div>
  );
};
export default IMU;
