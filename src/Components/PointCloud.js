import { useEffect, useRef, useState } from "react";
import { useRos } from "../Utils/RosConnProvider.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const PointCloud = () => {
  const { ros, isCon, refresh, topicSubDataRef, subscribedTopics } = useRos();
  const [gotDataPC, setGDPC] = useState(false);
  const [gotDataOd, setGDOd] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000)
  );

  const rendererRef = useRef(null);
  const pointCloudRef = useRef();
  const controlsRef = useRef(null);

  //Setup for Refs
  useEffect(() => {
    const mount = mountRef.current;

    //Only create a renderer if we do not currently have one.
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(400, 400);
      cameraRef.current.aspect = 400 / 400;
      cameraRef.current.updateProjectionMatrix();
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    //Camera things
    cameraRef.current.position.set(0, 0, 215);
    cameraRef.current.lookAt(0, 0, 0);

    // Add Axes Helper to show x, y, z directions at origin
    const axesHelper = new THREE.AxesHelper(50);
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
      controlsRef.current.screenSpacePanning = true; // Is this needed?
    }

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

  //Pulling data from subscription
  useEffect(() => {

    //Check Odometry
    setGDOd("Odometry" in subscribedTopics.current &&
      subscribedTopics.current["Odometry"].path in topicSubDataRef.current &&
      "message" in topicSubDataRef.current[subscribedTopics.current["Odometry"].path]);
    
    //Check Point Cloud
    setGDPC("Point Cloud" in subscribedTopics.current &&
      subscribedTopics.current["Point Cloud"].path in topicSubDataRef.current &&
      "message" in topicSubDataRef.current[subscribedTopics.current["Point Cloud"].path]);
    
    if (
      gotDataOd && gotDataPC && isCon
    ) {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];

      //Use Odometry message to adjust PC2 data
      const vehicleLocation = findVehicleLocation(
        topicSubDataRef.current[subscribedTopics.current["Odometry"].path]
          .message
      );
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationFromEuler(vehicleLocation.euler);

      parsePC2Data(
        topicSubDataRef.current[subscribedTopics.current["Point Cloud"].path]
          .message,
        vehicleLocation
      ).forEach((point) => {
        const { position, color } = point;
        //Need points in a vector to rotate them
        const pointVect = new THREE.Vector3(position.x, position.y, position.z); //Could probably refactor parse PC2Data for this...
        pointVect.applyMatrix4(rotationMatrix);

        //Push updated verticies & colors into array
        vertices.push(pointVect.x, pointVect.y, pointVect.z);
        colors.push(color.r, color.g, color.b);
      });
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      //Material for the points
      const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
      });

      //Memory clearing
      if (pointCloudRef.current) {
        sceneRef.current.remove(pointCloudRef.current);
        if (pointCloudRef.current.geometry) {
          pointCloudRef.current.geometry.dispose();
        }
        if (pointCloudRef.current.material) {
          pointCloudRef.current.material.dispose();
        }
        pointCloudRef.current = null;
      }

      //New PC for next pass
      const pointCloud = new THREE.Points(geometry, material);
      sceneRef.current.add(pointCloud);
      pointCloudRef.current = pointCloud;
    }
  }, [ros, isCon, refresh]);

  if (gotDataOd && gotDataPC){
    return (
      <div className="card">
        <h3 className="card-title"> Lidar </h3>
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
  else{
    return (
      <div className="card">
        <h3 className="card-title-warn"> Lidar {gotDataOd? "" : "| No Odometry"} {gotDataPC? "" : "| No Pointcloud"}</h3>
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

function parsePC2Data(message, vehicleLocation) {
  const points = [];
  let convertData = base64ToUint8Array(message.data);
  let dataView = new DataView(convertData.buffer); //Shove into a Dataview so that we can handle different data types in the future
  const { height, width, point_step, fields, is_bigendian } = message;

  //Cannot necicarily assume that all things follow the same offset pattern
  const xOffset = fields.find((f) => f.name === "x").offset;
  const yOffset = fields.find((f) => f.name === "y").offset;
  const zOffset = fields.find((f) => f.name === "z").offset;
  const intenOffset = fields.find((f) => f.name === "intensity").offset;

  //There are width * height points
  for (let i = 0; i < height * width; i++) {
    const startingIndex = i * point_step; //Where we start to read
    //Assuming type = 7 this should be revised to another function that actually handles things based upon type value and endian flag.
    //TODO: Make alt fucntionality paths if type is not 7
    const xData = dataView.getFloat32(startingIndex + xOffset, !is_bigendian);
    const yData = dataView.getFloat32(startingIndex + yOffset, !is_bigendian);
    const zData = dataView.getFloat32(startingIndex + zOffset, !is_bigendian);
    const intensity = dataView.getFloat32(
      startingIndex + intenOffset,
      !is_bigendian
    );

    //Turn intensity into a color
    const normalizedIntensity = (intensity || 0) / 255;
    const color = new THREE.Color();
    // Adjust hue based on intensity
    color.setHSL(normalizedIntensity, 1.0, 0.5); 
    points.push({
      position: {
        x: xData - vehicleLocation.x,
        y: yData - vehicleLocation.y,
        z: zData,
      },
      color: { r: color.r, g: color.g, b: color.b },
    });
  }

  dataView = null;
  convertData = null;

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

function findVehicleLocation(odomMessage) {
  const posx = odomMessage.pose.pose.position.x;
  const posy = odomMessage.pose.pose.position.y;

  //Quaternion to Euler
  const { x, y, z, w } = odomMessage.pose.pose.orientation;
  const quaternion = new THREE.Quaternion(x, y, z, w);
  const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");
  return { x: posx, y: posy, euler: euler };
}

export default PointCloud;
