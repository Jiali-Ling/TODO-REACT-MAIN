import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CameraProps() {
  return (
    <>
      <h2>Example with Props</h2>
      <Webcam
        audio={false}
        height={400}
        screenshotFormat="image/jpeg"
        width={600}
        videoConstraints={videoConstraints}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              console.log(imageSrc);
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
    </>
  );
}
