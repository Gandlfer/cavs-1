import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Map from "./routes/Map";
import Sensor from "./routes/Sensor";
import Status from "./routes/Status";
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import { RosProvider } from "./Utils/RosConnProvider";

const AppLayout = () => (
  <div className="container">
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
export const Router = ()=>{
  return(
    <RosProvider>
      <RouterProvider router={router} />
    </RosProvider>
    
  )
}
//entry point
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
