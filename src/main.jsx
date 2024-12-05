import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Map from "./routes/Map";
import Sensor from "./routes/Sensor";
import Status from "./routes/Status";
import Config from "./routes/Config";
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import { RosProvider } from "./Utils/RosConnProvider";
import { Toaster } from "react-hot-toast";

const AppLayout = () => (
  <div className="container">
    <Toaster position="top-center" toastOptions={{
          style: {
            fontSize: '13px',  // Smaller font size
            padding: '8px 12px',  // Adjust padding for a smaller overall size
          }
          
        }}/>
    <Header />
    <Navbar />
    <Outlet />
  </div>
);
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Config />
      },
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "sensor",
        element: <Sensor />,
      },
      {
        path: "status",
        element: <Status />,
      },
      {
        path: "config",
        element: <Config />,
      },
    ],
  },
]);
export const Router = () => {
  return (
    <RosProvider>
      <RouterProvider router={router} />
      
    </RosProvider>
  );
};
//entry point
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
