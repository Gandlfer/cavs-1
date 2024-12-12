import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRos } from "../Utils/RosConnProvider.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const IMU_Ang = () => {
  const { ros, isCon, refresh, topicSubDataRef, subscribedTopics } = useRos();
  const [gotDataIMU, setGDIMU] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000)
  );
  const rendererRef = useRef(null);
  const vehicleRef = useRef(null);
  const yawArrowRef = useRef(null);
  const pitchArrowRef = useRef(null);
  const rollArrowRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    //Only create a renderer if we do not currently have one
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(400, 400);
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    cameraRef.current.position.set(0.7, 1.5, 4.2); // Move the camera to ensure the axes are visible
    cameraRef.current.lookAt(0, 0, 0);
    // Add Axes Helper to show x, y, z directions at origin
    const axesHelper = new THREE.AxesHelper(15); // Adjust size as needed
    sceneRef.current.add(axesHelper);

    // Create the vehicle parts
    if (!vehicleRef.current) {
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

    //Arrows
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

    //Add the arrows
    vehicleRef.current.add(yawArrowRef.current);
    vehicleRef.current.add(pitchArrowRef.current);
    vehicleRef.current.add(rollArrowRef.current);

    //Disposal / cleanup
    return () => {
      //Dispose the renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement) {
          mount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }

      //Dispose the controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      //Dispose Scene Resources (maybe)
      sceneRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      //Dispose Axes Helper from scene
      sceneRef.current.remove(axesHelper);
      if (axesHelper.geometry) {
        axesHelper.geometry.dispose();
      }

      //Dispose the vehicle from scene
      if (vehicleRef.current) {
        sceneRef.current.remove(vehicleRef.current);
        vehicleRef.current = null;
      }

      //Nullify the arrows
      if (yawArrowRef.current) {
        yawArrowRef.current = null;
      }
      if (pitchArrowRef.current) {
        pitchArrowRef.current = null;
      }
      if (rollArrowRef.current) {
        rollArrowRef.current = null;
      }
    };
  }, []);

  //Animation
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
  }, []);

  useEffect(() => {
    //Check Odometry
    setGDIMU("IMU" in subscribedTopics.current &&
      subscribedTopics.current["IMU"].path in topicSubDataRef.current &&
      "message" in topicSubDataRef.current[subscribedTopics.current["IMU"].path]);

    
    if (
      isCon &&
      gotDataIMU &&
      vehicleRef.current
    ) {
      const { x, y, z } =
        topicSubDataRef.current[subscribedTopics.current["IMU"].path]
          .message.angular_velocity;
      const quaternion = new THREE.Quaternion(x, y, z);
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
    <div>
      <p className="IMU-label">Angular Vel.</p>
      <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    />
    </div>
  );
  
};
export default IMU_Ang;
