import { useRos } from "../Utils/RosConnProvider.js";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Waypoints = () => {
  const [gotDataWP, setGotDataWP] = useState(false);
  const [lastData, setLastData] = useState([[]]);
  const { ros, isCon, topicSubDataRef, refresh, subscribedTopics } = useRos();

  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000)
  );

  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const movingSphereRef = useRef(null);
  const waypointLineRef = useRef(null);
  const waypointPointRef = useRef(null);

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
      controlsRef.current.enableDamping = true; // Smooth transitions
      controlsRef.current.dampingFactor = 0.25;
      controlsRef.current.screenSpacePanning = true; // Is this needed?
    }

    // Inside the initial setup (first useEffect)
    const sphereGroup = new THREE.Group(); // Group for spheres
    sceneRef.current.add(sphereGroup);
    waypointPointRef.current = sphereGroup; // Store the reference

    //Create the moving sphere
    if (!movingSphereRef.current) {
      const sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x21A9FF, // Light Blue
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
    setGotDataWP(
      "Waypoint" in subscribedTopics.current &&
        subscribedTopics.current["Waypoint"].path in
          topicSubDataRef.current &&
        "message" in
          topicSubDataRef.current[subscribedTopics.current["Waypoint"].path]
    );

    

    if (gotDataWP && isCon) {
      const pathData = getDataArray(
        topicSubDataRef.current[subscribedTopics.current["Waypoint"].path].message.poses
      );
    
      //We only want to redraw the GP if the data is fresh. 
      let newData = lastData.length != pathData.length;
      
      //If two different datasizes, and lastData is not size 0
      if (!newData && lastData.length > 0) {
        for(let i = 0; i < lastData.length; i++){
          if (lastData[i][0] != pathData[i][0] || lastData[i][1] != pathData[i][1] || lastData[i][2] != pathData[i][2]) {
            newData = true;
            break;
          }
        }
      }


      //Add points and lines for the waypoints
      if (pathData.length > 0 && newData) {
        setLastData(pathData);

        // Clear existing waypoints
        if (waypointPointRef.current) {
          waypointPointRef.current.children.forEach((child) => {
            sceneRef.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
          waypointPointRef.current.clear();
        }

        //Create spheres for poses
        const sphereGeometry = new THREE.SphereGeometry(3, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xFFFF00});
        
        pathData.forEach((pose) => {
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(...pose);
          waypointPointRef.current.add(sphere);
          sceneRef.current.add(sphere);
        });

        //Create a line connecting the poses
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          pathData.map((pose) => new THREE.Vector3(...pose))
        );
        const line = new THREE.Line(lineGeometry, lineMaterial);

        //Memory clearing
        if (waypointLineRef.current) {
          sceneRef.current.remove(waypointLineRef.current);
          if (sceneRef.current.line) {
            sceneRef.current.line.dispose();
          }

          waypointLineRef.current = null;
        }

        sceneRef.current.add(line);
        waypointLineRef.current = line;
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

        //If you want the camera to constantly snap to the vehicle's location
        cameraRef.current.lookAt(position.x, position.y, 0);
        //cameraRef.current.position.set(position.x, position.y, 215);
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

  if (gotDataWP) {
    return (
      <div className="card" id="Waypoints">
        <h3 className="card-title"> Waypoints </h3>
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
        <h3 className="card-title-warn"> Waypoints | No Waypoints </h3>
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

export default Waypoints;
