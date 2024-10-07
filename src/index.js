import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ROSLIB from 'roslib';
import RosConnection from './RosConnection.js';
//import Test from './Components/Test.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
//console.log(s)
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);