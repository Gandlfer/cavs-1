import React, { useState,useEffect } from 'react';
import ROSLIB from 'roslib';

const RosConnection=(props)=>{
    const [ros, setRos] = useState(0);
    useEffect(()=>{
        let rosConn = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
    })

        rosConn.on('error', function(error) { console.log('Connection Error'+ error); });
        rosConn.on('connection', function() { 
                console.log('Connection made!'); 
            });
            rosConn.on('close',()=>{
                console.log('Connection Close!');
            })
             setRos(rosConn)
            return () =>{
                rosConn.close()
            }
    },[])
    // if (!ros){
    //     return <p>Connecting to ROS...</p>;
    // }
    return (
        <div>
            {props.children(ros)} {/* Pass ros directly to children */}
        </div>
    );

}

export default RosConnection;