import React, { useState } from "react";
import * as Io5 from "react-icons/io5";
import { NavLink, Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../index.css";
import { IconContext } from "react-icons";
import { useRos } from "../Utils/RosConnProvider";
import ROSLIB from "roslib";
import ControllerButton from "./ControllerButtons";

export default function Navbar() {
  const { ros, isCon, refresh } = useRos();
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  return (
    <>
      {/* <TestComponent></TestComponent> */}
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bar">
            <Io5.IoReorderThree onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle" onClick={showSidebar}>
              <Link to="#" className="close-tab">
                <Io5.IoCloseCircleOutline />
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "map" ? "nav-text active" : "nav-text"
              }
            >
              <Link to="/map">
                <span id="nav-span">
                  <Io5.IoMap />
                </span>
                <span id="nav-span">Map</span>
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "sensor" ? "nav-text active" : "nav-text"
              }
            >
              <Link to="/sensor">
                <span id="nav-span">
                  <Io5.IoCamera />
                </span>
                <span id="nav-span">Sensor</span>
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "status" ? "nav-text active" : "nav-text"
              }
            >
              <Link to="/status">
                <span id="nav-span">
                  <Io5.IoTerminal />
                </span>
                <span id="nav-span">Status</span>
              </Link>
            </li>
          </ul>
          <div className="navbar-controller">
            {/* <button className="ctrl-button" >
              <Io5.IoPlay onClick={buttonPress}/>
            </button> */}
            <ControllerButton/>
            <button className="ctrl-button">
              <Io5.IoPause />
            </button>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}
