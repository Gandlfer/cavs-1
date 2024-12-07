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
  const subscribedTopics = useRef({});
  const inactiveTopicsRef = useRef(new Set());
  const defaultURLRef = useRef(
    localStorage.getItem("ServerURL")
      ? JSON.stringify(localStorage.getItem("ServerURL"))
      : "localhost:9090"
  );
  const [refresh, setRefresh] = useState(false);
  const [availableTopicsRefresh, setAvailableTopicsRefresh] = useState([]);
  let temp = useRef(false);
  const [load, setLoad] = useState(true);
  let rosConn;

  // Input a list of "Label" : "Path"
  const subscribeToTopics = (topicList) => {
    Object.keys(topicList).forEach((topicLabel) => {
      const topicName = topicList[topicLabel];
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

      subscribedTopics.current[topicLabel] = {
        path: topicName,
        topicSub: newTopic,
      };
      // Mark as inactive initially
      inactiveTopicsRef.current.add(topicName);

      topicSubDataRef.current[topicName] = {};

      newTopic.subscribe((message) => {
        if (!("prevTime" in topicSubDataRef.current[topicName])) {
          //topicSubDataRef.current[topicName] = {};
          topicSubDataRef.current[topicName].prevTime = Date.now();
          topicSubDataRef.current[topicName].pubRate = 0;
          //topicSubDataRef.current[topicName].pubRate = 0;
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
    Object.keys(subscribedTopics.current).forEach((topicLabel) => {
      if (subscribedTopics.current[topicLabel]) {
        subscribedTopics.current[topicLabel].topicSub.unsubscribe();
      }
    });
    subscribedTopics.current = {};
    topicSubDataRef.current = {};
    // Subscribe to only the selected topics
    subscribeToTopics(newTopics);
  };

  const setAvailableTopics = () => {
    ros.getTopics((result) => {
      setAvailableTopicsRefresh(result.topics);
    });
  };

  const reconnectRos = (newUrl) => {
    if (ros) {
      ros.close();
    }
    setLoading(true);
    defaultURLRef.current = newUrl;
    const newRos = new ROSLIB.Ros({
      url: "ws://" + defaultURLRef.current,
    });

    setRos(newRos);
    setLoading(false);
  };

  // Check for topics with no data periodically
  if (isCon) {
    setInterval(() => {
      const now = Date.now();
      Object.keys(topicSubDataRef.current).forEach((topicName) => {
        if (!("prevTime" in topicSubDataRef.current[topicName])) {
          //topicSubDataRef.current[topicName].prevTime = Date.now();
          topicSubDataRef.current[topicName].pubRate = 0;
        } else {
          const lastUpdated = topicSubDataRef.current[topicName].prevTime;

          if (now - lastUpdated > 60000) {
            // Mark as inactive if no update in the last 5 seconds
            topicSubDataRef.current[topicName].pubRate = 0;
          }
        }
      });
    }, 60000);
  }

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
      subscribeToTopics(
        localStorage.getItem("ConfigData")
          ? JSON.parse(localStorage.getItem("ConfigData")).reduce(
              (acc, obj) => {
                acc[obj.name] = obj.path;
                return acc;
              },
              {}
            )
          : ConfigData.reduce((acc, obj) => {
              acc[obj.name] = obj.path;
              return acc;
            }, {})
      );
    }
    return () => {
      if (ros != null) {
        //topicSubDataRef.current.keys().map((topicName, i) => {});
        topicSubDataRef.current = {};
        ros.close();
      }
    };
  }, [ros]);
  if (ros != null) {
    ros.on("error", function (error) {
      setIsCon(false);
    });
    ros.on("connection", function () {
      setIsCon(true);
      setAvailableTopics();
    });
    ros.on("close", () => {
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
        subscribedTopics,
        resubscribeToTopics,
        reconnectRos,
      }}
    >
      {children}
    </RosContext.Provider>
  );
};
