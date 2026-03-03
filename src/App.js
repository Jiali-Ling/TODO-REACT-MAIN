import "./styles.css";
import CameraProps from "./CameraProps";
// import CameraRef from "./CameraRef";

// If you want to try the camera with props -> Comment CameraRef and uncomment CameraProps
// If you want to try the camera with Ref -> Comment CameraProps and uncomment CameraRef
export default function App() {
  return (
    <div className="App">
      <h1>Week 07 - Accesing the Camera</h1>
      <CameraProps />
      {/* <CameraRef /> */}
    </div>
  );
}