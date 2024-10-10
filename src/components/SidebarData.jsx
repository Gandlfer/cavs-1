import React, { useState } from "react";
import * as Io5 from "react-icons/io5";

export const SidebarData = [
  {
    title: "Map",
    path: "/map",
    icons: <Io5.IoMap />,
    cName: "nav-text",
  },
  {
    title: "Sensor",
    path: "/sensor",
    icons: <Io5.IoCamera />,
    cName: "nav-text",
  },
  {
    title: "Status",
    path: "/status",
    icons: <Io5.IoTerminal />,
    cName: "nav-text",
  },
];
