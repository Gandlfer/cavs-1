import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    //Disposal - JIC user leaves page first
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="notFound" className="body">
      <div className="status-card">
        <h3 className="card-title">404 Page Not Found</h3>
        <p> Redirecting... </p>
      </div>
    </div>
  );
}

export default NotFound;
