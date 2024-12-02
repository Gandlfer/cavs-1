import React,{useState} from "react";
import ConfigData from "../PlaceholderFiles/ConfigData";
import ConfigTopicAvailable from "../Components/ConfigTopicAvailable";
import { useRos } from "../Utils/RosConnProvider";
import * as Io5 from "react-icons/io5";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function Config() {
  const { defaultURLRef,resubscribeToTopics } = useRos();
  const [config, setConfig] = useState(ConfigData);
  const notify = () => toast.success("Path Saved");

  // Handle input changes
  const handleInputChange = (index, newPath) => {
    const updatedConfig = [...config];
    updatedConfig[index].path = newPath;
    setConfig(updatedConfig);
  };

  // Save data 
  const handleSave = () => {
    // Here you can send the `config` state to your backend or update the file
    console.log("Saving Config:", config);
    console.log(config.map((obj) => obj.path))
    resubscribeToTopics(config.map((obj) => obj.path))
    notify();
  };

  return (
    <div id="config-container" className="body">
      <div id="server-box" className="status-card">
        <span id="server-name" className="topic-name">
          Server Address
        </span>
        <input
          id="server-path"
          className="topic-path"
          label="Server Address"
          defaultValue={"ws://" + defaultURLRef.current}
        />
        <button
          id="save-server-button"
          className="ctrl-button"
          onClick={notify}
        >
          <Io5.IoSaveOutline />
        </button>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </div>
      <div className="status-card">
        <h3 className="card-title">Components</h3>
        <div className="config-components">
          <ul>
            {ConfigData.map((val, key) => {
              return (
                <li key={key} className="topic">
                  <span className="topic-name" id={"light"}>
                    {val.name}
                  </span>
                  <input className="topic-path" defaultValue={val.path} onChange={(e) => handleInputChange(key, e.target.value)}/>
                </li>
              );
            })}
          </ul>
        </div>
        <button id="save-config" onClick={handleSave}>
          Save
        </button>
      </div>
      <ConfigTopicAvailable />
    </div>
  );
}
