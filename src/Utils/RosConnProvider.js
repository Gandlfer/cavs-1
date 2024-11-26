import { useState, createContext, useContext, useEffect, useRef } from "react";
import ROSLIB from "roslib";
import DefaultServerUrl from "../PlaceholderFiles/ConfigData.jsx";

const RosContext = createContext();

export const useRos = () => {
  return useContext(RosContext);
};

export const RosProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isCon, setIsCon] = useState(false);
  const [error, setError] = useState(null);
  const [ros, setRos] = useState(null);
  const topicSubDataRef = useRef({});
  const subcribedTopics = useRef({});
  const defaultURLRef = useRef("localhost:9090");
  const [refresh, setRefresh] = useState(false);
  const [availableTopicsRefresh, setAvailableTopicsRefresh] = useState([]);
  let temp = useRef(false);
  const [load, setLoad] = useState(true);
  let rosConn;

  const setSubscribedTopics = (data) => {};

  const setAvailableTopics = () => {
    ros.getTopics((result) => {
      availableTopics.current = result.topics;
      setAvailableTopicsRefresh(result.topics);
    });
  };

  useEffect(() => {
    function connection() {
      setLoading(true);
      rosConn = new ROSLIB.Ros({
        url: "ws://" + defaultURLRef.current,
      });
      setRos(rosConn);
      setLoading(false);
    }
    connection();
  }, []);

  useEffect(() => {
    if (ros) {
      ros.getTopics((result) => {
        result.topics.forEach((topicName, i) => {
          if (
            topicName == "/mavs_ros/image" ||
            topicName == "/nature/global_path" ||
            topicName == "/nature/local_path" ||
            topicName == "/nature/occupancy_grid" ||
            topicName == "/nature/odometry" ||
            topicName == "/nature/state" ||
            topicName == "/nature/waypoints" ||
            topicName == "/nature/points" ||
            topicName == "/mavs_ros/imu"
          ) {
            const testTopic = new ROSLIB.Topic({
              ros: ros,
              name: topicName,
              messageType: result["types"][i],
            });

            testTopic.subscribe((message) => {
              if (!(topicName in topicSubDataRef.current)) {
                topicSubDataRef.current[topicName] = {};
                topicSubDataRef.current[topicName].prevTime = Date.now();
                topicSubDataRef.current[topicName].pubRate = 0;
              } else {
                let rate =
                  1 /
                  ((Date.now() - topicSubDataRef.current[topicName].prevTime) /
                    1000);

                if (isFinite(rate)) {
                  topicSubDataRef.current[topicName].pubRate = Math.ceil(rate);
                } else {
                  topicSubDataRef.current[topicName].pubRate = 0;
                }

                topicSubDataRef.current[topicName].prevTime = Date.now();
              }
              topicSubDataRef.current[topicName].message = message;
              temp = !temp;
              setRefresh(temp);
            });
          }
        });
      });
    }
    return () => {
      if (ros != null) {
        topicSubDataRef.current.keys().map((topicName, i) => {});
        topicSubDataRef.current = {};
        ros.close();
      }
    };
  }, [ros]);
  if (ros != null) {
    ros.on("error", function (error) {
      console.log("Connection Error" + error);
      setIsCon(false);
    });
    ros.on("connection", function () {
      console.log("Connection made!");
      setIsCon(true);
      setAvailableTopics();
      //console.log(ros);
    });
    ros.on("close", () => {
      console.log("Connection Close!");
      setIsCon(false);
    });
  }
  return (
    <RosContext.Provider
      value={{
        defaultURLRef,
        ros,
        isCon,
        topicSubDataRef,
        refresh,
        subcribedTopics,
        availableTopicsRefresh,
      }}
    >
      {children}
    </RosContext.Provider>
  );
};
