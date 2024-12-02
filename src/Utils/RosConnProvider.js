import { useState, createContext, useContext, useEffect, useRef } from "react";
import ROSLIB from "roslib";
import DefaultServerUrl from "../PlaceholderFiles/ConfigData.jsx";
import ConfigData from "../PlaceholderFiles/ConfigData.jsx";
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

  const subscribeToTopics = (topicList) => {
    topicList.forEach((topicName) => {
      let topicType;
      ros.getTopicType(
        topicName,
        (type) => {
          topicType = type;
        },
        (error) => {
          console.log(error);
        }
      );

      const newTopic = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: topicType,
      });
      subcribedTopics.current[topicName] = newTopic;
      newTopic.subscribe((message) => {
        if (!(topicName in topicSubDataRef.current)) {
          topicSubDataRef.current[topicName] = {};
          topicSubDataRef.current[topicName].prevTime = Date.now();
          topicSubDataRef.current[topicName].pubRate = 0;
        } else {
          let rate =
            1 /
            ((Date.now() - topicSubDataRef.current[topicName].prevTime) / 1000);

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
    });
  };

  const resubscribeToTopics = (newTopics) => {
    // Unsubscribe from all current topics
    Object.keys(subcribedTopics.current).forEach((topicName) => {
      if (subcribedTopics.current[topicName]) {
        subcribedTopics.current[topicName].unsubscribe();
        console.log("Unsubscribing");
      }
    });
    subcribedTopics.current = {};

    console.log("Resub");
    // Subscribe to only the selected topics
    subscribeToTopics(newTopics);
  };

  const setAvailableTopics = () => {
    ros.getTopics((result) => {
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
      subscribeToTopics(ConfigData.map((obj) => obj.path));
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
        availableTopicsRefresh,
        resubscribeToTopics,
      }}
    >
      {children}
    </RosContext.Provider>
  );
};
