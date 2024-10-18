import React from "react";
import Card from "../Components/Card";

export default function Status() {
  return (
    <div id="status-tab" className="body">
      <div id="console" className="status-card">
        console
      </div>
      <div id="ros-bag" className="status-card">
        ros-bag
      </div>
      <div id="topics-list" className="status-card">
        <h4>topics</h4>
        <ul>
          <li>Topic 1</li>
          <li>Topic 2</li>
          <li>Topic 3</li>
          <li>Topic 4</li>
          <li>Topic 5</li>
        </ul>
      </div>
    </div>
  );
}
