import { useEffect } from "react";
import { useRos } from "../Utils/RosConnProvider.js";

const ConfigTopicAvailable = () => {
  const { ros, isCon, availableTopicsRefresh } = useRos();

  useEffect(() => {}, [ros]);

  return (
    <div className="status-card" id="config-available-card">
      <h3 className="card-title">Topics Available</h3>
      <ul id="config-available">
        {isCon && availableTopicsRefresh.length > 0 ? (
          availableTopicsRefresh.map((element) => {
            return (
              <li key={element} className="topic">
                <span className="topic-name" id={"light"}>
                  {element}
                </span>
              </li>
            );
          })
        ) : (
          <div>No websocket connection.</div>
        )}
      </ul>
    </div>
  );
};

export default ConfigTopicAvailable;
