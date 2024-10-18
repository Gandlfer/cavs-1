import pic from "../vite.svg";
import "../index.css";

export default function Card() {
  return (
    <div className="card">
      <img className="card-img" src={pic} alt="camera topic"></img>
      <h2 className="card-name">Card</h2>
      <p>Topic from MAVS</p>
    </div>
  );
}
