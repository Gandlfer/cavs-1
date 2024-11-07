import React, { useState, useEffect, useRef } from "react";
import ROSLIB from "roslib";
import * as THREE from "three";
import { useRos } from "../Utils/RosConnProvider.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

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
  const vehicleRef = useRef(null);
  const linearVelocityArrowRef = useRef(null);
  const angularVelocityArrowRef = useRef(null);
  const yawArrowRef = useRef(null);
  const pitchArrowRef = useRef(null);
  const rollArrowRef = useRef(null);
  const controlsRef = useRef(null);

  const topicName = "/nature/odometry";
  const [data, setData] = useState(0);
  useEffect(() => {
    //console.log(topicSubDataRef.current[topicName]);
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);
    cameraRef.current.position.set(5, 5, 10); // Move the camera to ensure the axes are visible
    cameraRef.current.lookAt(0, 0, 0);
    // Add Axes Helper to show x, y, z directions at origin
    const axesHelper = new THREE.AxesHelper(15); // Adjust size as needed
    sceneRef.current.add(axesHelper);
    // Create the vehicle parts
    if (!vehicleRef.current) {
      console.log("here");
      const vehicle = new THREE.Group();

      // Body - narrower width, greater length
      const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2); // Width, height, depth
      const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.25; // slightly above the ground
      vehicle.add(body);

      // Roof - slightly narrower and positioned upward
      const roofGeometry = new THREE.BoxGeometry(0.6, 0.3, 1.2);
      const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x0055aa });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(0, 0.6, -0.1); // higher up and centered
      vehicle.add(roof);

      // Wheels - adjust for narrower width
      const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 12); // Width of wheels adjusted
      const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

      const wheelPositions = [
        [-0.5, 0, 1],
        [0.5, 0, 1], // back wheels
        [-0.5, 0, -1],
        [0.5, 0, -1], // front wheels
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(x, y, z);
        wheel.rotation.z = Math.PI / 2; // Set wheel rotation to lay flat
        vehicle.add(wheel);
      });

      sceneRef.current.add(vehicle);
      vehicleRef.current = vehicle;

      console.log("Here");
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
    }

    // Add yaw, pitch, roll arrows
    if (!yawArrowRef.current) {
      yawArrowRef.current = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        1.5,
        0xff0000
      );
    }
    if (!pitchArrowRef.current) {
      pitchArrowRef.current = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        1.5,
        0x00ff00
      );
    }
    if (!rollArrowRef.current) {
      rollArrowRef.current = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        2,
        0x0000ff
      );
    }
    vehicleRef.current.add(yawArrowRef.current);
    vehicleRef.current.add(pitchArrowRef.current);
    vehicleRef.current.add(rollArrowRef.current);

    // Clean up on component unmount
    // return () => {
    //   mountRef.current.removeChild(rendererRef.current.domElement);
    //   rendererRef.current.dispose();
    // };
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
    if (isCon && topicName in topicSubDataRef.current && vehicleRef.current) {
      console.log(topicSubDataRef.current[topicName].message);
      const { x, y, z } =
        topicSubDataRef.current[topicName].message.twist.twist.angular; // Extract quaternion data from imuData
      const quaternion = new THREE.Quaternion(x, y, z);
      console.log(quaternion);
      const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");
      const { x: pitch, y: yaw, z: roll } = euler;
      //console.log(euler);
      //vehicleRef.current.rotation.set(pitch, yaw, roll);
      vehicleRef.current.setRotationFromQuaternion(quaternion);

      // Update yaw, pitch, roll based on orientation
      yawArrowRef.current.setDirection(
        new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion)
      );
      pitchArrowRef.current.setDirection(
        new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion)
      );
      rollArrowRef.current.setDirection(
        new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion)
      );
    }
  }, [[ros, isCon, refresh]]);
  return (
    <div className="card" id="IMU-card">
      <h3 className="card-title"> IMU </h3>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
export default IMU;
