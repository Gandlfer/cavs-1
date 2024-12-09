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
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const MapComponent = () => {
  const [globalPath, setGlobalPath] = useState([]);
  const [gotDataGP, setGotDataGP] = useState(false);
  const { ros, isCon, topicSubDataRef, refresh, subscribedTopics } = useRos();

  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000) //Here
  );

  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const movingSphereRef = useRef(null);
  const globalPathLineRef = useRef(null);
  const globalPathPointRef = useRef(null);

  const getDataArray = (arr) => {
    return arr.map((obj) => [
      obj.pose.position.x,
      obj.pose.position.y,
      obj.pose.position.z || 0, // Use Z-coordinate if available, default to 0
    ]);
  };

  useEffect(() => {
    const mount = mountRef.current;

    //Only create a renderer if we do not currently have one.
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(400, 400);
      cameraRef.current.aspect = 400 / 400;
      cameraRef.current.updateProjectionMatrix();

      if (mountRef.current) {
        mountRef.current.appendChild(rendererRef.current.domElement);
      } else {
        console.error("Mount reference is null.");
      }
    }

    //Camera things
    cameraRef.current.position.set(0, 0, 215);
    //cameraRef.current.lookAt(0, 0, 0);

    // Add ambient light for visibility
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    sceneRef.current.add(directionalLight);

    // Orbit Controls setup
    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.25;
      // controlsRef.current.screenSpacePanning = false;
      controlsRef.current.enablePan = true;
      controlsRef.current.enableRotate = false;
    }

    // Inside the initial setup (first useEffect)
    const sphereGroup = new THREE.Group(); // Group for spheres
    sceneRef.current.add(sphereGroup);
    globalPathPointRef.current = sphereGroup; // Store the reference

    //Create the moving sphere
    if (!movingSphereRef.current) {
      const sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, // Green
      });

      const movingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sceneRef.current.add(movingSphere);
      movingSphereRef.current = movingSphere;
    }

    //Disposal
    return () => {
      //Cleanup when component unmounts
      if (rendererRef.current) {
        rendererRef.current.dispose(); // Dispose renderer
        if (rendererRef.current.domElement)
          mount.removeChild(rendererRef.current.domElement);
        rendererRef.current = null;
      }

      //Dispose controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      //Dispose scene resources
      const scene = sceneRef.current;
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    setGotDataGP(
      "Global Path" in subscribedTopics.current &&
        subscribedTopics.current["Global Path"].path in
          topicSubDataRef.current &&
        "message" in
          topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
    );

    if (gotDataGP && isCon) {
      const pathData = getDataArray(
        topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
          .message.poses
      );
      //Add points and lines for the global path
      if (pathData.length > 0) {
        // Clear existing global path objects
        if (globalPathPointRef.current) {
          globalPathPointRef.current.children.forEach((child) => {
            sceneRef.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
          globalPathPointRef.current.clear();
        }

        //Create spheres for poses
        const sphereGeometry = new THREE.SphereGeometry(2, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00,
        });
        pathData.forEach((pose) => {
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(...pose);
          globalPathPointRef.current.add(sphere);
          sceneRef.current.add(sphere);
        });

        //Create a line connecting the poses
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          pathData.map((pose) => new THREE.Vector3(...pose))
        );
        const line = new THREE.Line(lineGeometry, lineMaterial);

        //Memory clearing
        if (globalPathLineRef.current) {
          sceneRef.current.remove(globalPathLineRef.current);
          if (sceneRef.current.line) {
            sceneRef.current.line.dispose();
          }

          globalPathLineRef.current = null;
        }

        sceneRef.current.add(line);
        globalPathLineRef.current = line;
      }
    }

    if (
      "Odometry" in subscribedTopics.current &&
      subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
      "message" in
        topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
    ) {
      if (movingSphereRef.current) {
        const position =
          topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
            .message.pose.pose.position;
        movingSphereRef.current.position.set(position.x, position.y, 0);

        cameraRef.current.lookAt(position.x, position.y, 0);
        cameraRef.current.position.set(position.x, position.y, 215);
      }
    }
  }, [ros, isCon, refresh]);

  //New animation loop
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current)
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    //Cleanup old frames
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (gotDataGP) {
    return (
      <div className="card" id="Global Path">
        <h3 className="card-title"> Global Path </h3>
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
  } else {
    return (
      <div className="card" id="IMU-card">
        <h3 className="card-title-warn"> Global Path | No Global Path </h3>
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
  }
};
export default MapComponent;
