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
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const { ros, isCon, topicSubDataRef, refresh, subscribedTopics } = useRos();

  // const getDataArray = (arr) => {
  //   let dataArray = [];
  //   console.log(arr);
  //   arr.forEach((obj) => {
  //     dataArray.push([obj.pose.position.x, obj.pose.position.y]);
  //   });
  //   return dataArray;
  // };

  // useEffect(() => {
  //   if (
  //     "Local Path" in subscribedTopics.current &&
  //     "Global Path" in subscribedTopics.current &&
  //     subscribedTopics.current["Local Path"].path in topicSubDataRef.current &&
  //     subscribedTopics.current["Global Path"].path in topicSubDataRef.current &&
  //     "message" in
  //       topicSubDataRef.current[subscribedTopics.current["Global Path"].path] &&
  //     "message" in
  //       topicSubDataRef.current[subscribedTopics.current["Local Path"].path]
  //   ) {
  //     console.log(
  //       topicSubDataRef.current[subscribedTopics.current["Local Path"].path]
  //         .message
  //     );
  //     console.log(
  //       topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
  //         .message
  //     );
  //     setGlobalPath(
  //       // getDataArray(
  //       //   topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
  //       //     .message.poses
  //       // )
  //       getDataArray(
  //         topicSubDataRef.current[subscribedTopics.current["Local Path"].path]
  //           .message.poses
  //       )
  //     );
  //   }
  //   if (
  //     "Odometry" in subscribedTopics.current &&
  //     subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
  //     "message" in
  //       topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
  //   ) {
  //     // console.log(
  //     //   topicSubDataRef.current[testTopicName].message.pose.pose.position
  //     // );
  //     setCurrentPosition([
  //       topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
  //         .message.pose.pose.position.x,
  //       topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
  //         .message.pose.pose.position.y,
  //     ]);
  //   }
  // }, [ros, isCon, refresh]);
  // return (
  //   <>
  //     {/* {console.log("Update")} */}
  //     {isCon ? (
  //       <MapContainer
  //         center={[33.453892, -88.788887]}
  //         zoom={17}
  //         scrollWheelZoom={true}
  //         style={{ height: "100%", width: "100%" }}
  //       >
  //         <TileLayer
  //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //         />
  //         <Marker position={currentPosition}>
  //           <Popup>Current Moving Vehicle Placeholder marker</Popup>
  //         </Marker>
  //         <Polyline pathOption={{ color: "red" }} positions={globalPath} />
  //       </MapContainer>
  //     ) : (
  //       <MapContainer
  //         center={[33.453892, -88.788887]}
  //         zoom={17}
  //         scrollWheelZoom={true}
  //         style={{ height: "100%", width: "100%" }}
  //       >
  //         <TileLayer
  //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //         />
  //         <Marker position={[33.453892, -88.788887]}>
  //           <Popup>
  //             Start point <br /> Mississippi State University
  //           </Popup>
  //         </Marker>
  //         <Marker position={[33.452, -88.7884]}>
  //           <Popup>
  //             Destination <br /> Mississippi State University
  //           </Popup>
  //         </Marker>
  //         <Polyline pathOption={{ color: "red" }} positions={polyline1} />
  //       </MapContainer>
  //     )}
  //   </>
  // );
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000) //Here
  );

  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const movingSphereRef = useRef(null);
  const globalPathRef = useRef(null);
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
      rendererRef.current.setSize(500, 500); //Here
      cameraRef.current.aspect = 500 / 500;
      cameraRef.current.updateProjectionMatrix();

      if (mountRef.current) {
        mountRef.current.appendChild(rendererRef.current.domElement);
      } else {
        console.error("Mount reference is null.");
      }
    }

    // Add Axes Helper to show x, y, z directions at origin
    // const axesHelper = new THREE.AxesHelper(50);
    // sceneRef.current.add(axesHelper);

    //Camera things
    cameraRef.current.position.set(0, 0, 10);
    cameraRef.current.lookAt(0, 0, 0);

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

    // Create the moving sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00, // Green
    });
    const movingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneRef.current.add(movingSphere);
    movingSphereRef.current = movingSphere;

    //Disposal
    return () => {
      // Cleanup when component unmounts
      if (rendererRef.current) {
        rendererRef.current.dispose(); // Dispose renderer
        if (rendererRef.current.domElement)
          mount.removeChild(rendererRef.current.domElement);
        rendererRef.current = null;
      }

      // Dispose controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      // Dispose scene resources
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
    if (
      "Global Path" in subscribedTopics.current &&
      subscribedTopics.current["Global Path"].path in topicSubDataRef.current &&
      "message" in
        topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
    ) {
      const pathData = getDataArray(
        topicSubDataRef.current[subscribedTopics.current["Global Path"].path]
          .message.poses
      );
      //setGlobalPath(getDataArray(pathData));
      //console.log(globalPath.length);
      // Add points and lines for the global path
      if (pathData.length > 0) {
        // Create spheres for poses
        const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00,
        });
        //console.log(pathData);
        pathData.forEach((pose) => {
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(...pose);
          sceneRef.current.add(sphere);
        });

        // Create a line connecting the poses
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          pathData.map((pose) => new THREE.Vector3(...pose))
        );
        const line = new THREE.Line(lineGeometry, lineMaterial);
        sceneRef.current.line;
        sceneRef.current.add(line);
        globalPathRef.current = line;
      }
    }
    if (
      "Odometry" in subscribedTopics.current &&
      subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
      "message" in
        topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
    ) {
      // console.log(
      //   topicSubDataRef.current[testTopicName].message.pose.pose.position
      // );
      if (movingSphereRef.current) {
        movingSphereRef.current.position.set(
          topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
            .message.pose.pose.position.x,
          topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
            .message.pose.pose.position.y,
          0
        );
        // cameraRef.current.position.set(
        //   topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
        //     .message.pose.pose.position.x,
        //   topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
        //     .message.pose.pose.position.y,
        //   0
        // );
        // cameraRef.current.lookAt(movingSphereRef.current.position);
      }
      // setCurrentPosition([
      //   topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
      //     .message.pose.pose.position.x,
      //   topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
      //     .message.pose.pose.position.y,
      // ]);
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

  return <div ref={mountRef} />;
};
export default MapComponent;
