import * as React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Map from "./routes/Map";
import Sensor from "./routes/Sensor";
import Config from "./routes/Config";
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import NotFound from "./routes/NotFound";
import { RosProvider } from "./Utils/RosConnProvider";
import { Toaster } from "react-hot-toast";

const AppLayout = () => (
  <div className="container">
    <Toaster position="top-center" toastOptions={{
          style: {
            fontSize: '13px', 
            padding: '8px 12px',
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
        path: "config",
        element: <Config />,
      },
      //404
      {
        path: "*",
        element: <NotFound />,
      }
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

