// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App.js";
// import main
// const root = ReactDOM.createRoot(document.getElementById("root"));
// //console.log(s)
// root.render(<App />);

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Map from "./routes/Map.jsx";
import Sensor from "./routes/Sensor.jsx";
import Status from "./routes/Status.jsx";
import Navbar from "./Components/Navbar.jsx";
import Header from "./Components/Header.jsx";

const AppLayout = () => (
  <div className="container">
    <Header />
    <Navbar />
    <Outlet />
  </div>
);
function App() {
  const [loading, setLoading] = useState(true);
  const [rosConn, setRosConn] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function connection() {
      setLoading(true);
      ros = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });
      setLoading(false);
    }
    connection();
    return () => {
      if (ros != null) {
        ros.close();
      }
    };
  }, [ros]);
  if (!loading && ros != null) {
    //console.log(ros);
    ros.on("error", function (error) {
      console.log("Connection Error" + error);
      setRosConn(false);
    });
    ros.on("connection", function () {
      console.log("Connection made!");
      setRosConn(true);
    });
    ros.on("close", () => {
      console.log("Connection Close!");
      setRosConn(false);
    });
  }
  return (
    <div>
      <p>
        {loading ? "Trying to Connect" : null}
        {rosConn ? "Connected to Ros" : "Disconnected"}
      </p>
      {rosConn ? <Camera ros={ros} /> : null}
      {/* {rosConn ? <Test ros={ros} /> : null}
        {rosConn ? <IMU ros={ros} /> : null} */}
    </div>
  );
}
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Map />,
        children: [
          {
            path: "/map",
            element: <Map />,
          },
        ],
      },
      {
        path: "sensor",
        element: <Sensor />,
      },
      {
        path: "status",
        element: <Status />,
      },
    ],
  },
]);

//entry point
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
