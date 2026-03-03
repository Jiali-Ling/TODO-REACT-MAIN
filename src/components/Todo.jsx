import { useEffect, useRef, useState, useCallback } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db.jsx";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const WebcamCapture = (props) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const savePhoto = (id, imgSrc) => {
    addPhoto(id, imgSrc);
  };

  const cancelPhoto = () => {
    setImgSrc(null);
  };

  return (
    <>
      {!imgSrc && (
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      )}
      {imgSrc && <img src={imgSrc} alt="captured" />} 
      <div className="btn-group">
        {!imgSrc && (
          <button type="button" className="btn" onClick={capture}>
            Capture photo
          </button>
        )}
        {imgSrc && (
          <button type="button" className="btn" onClick={() => savePhoto(props.id, imgSrc)}>
            Save Photo
          </button>
        )}
        {imgSrc && (
          <button type="button" className="btn todo-cancel" onClick={cancelPhoto}>
            Cancel
          </button>
        )}
      </div>
    </>
  );
};

const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
  return (
    <div>
      {photoSrc ? <img src={photoSrc} alt={props.name} /> : <p>No photo available</p>}
    </div>
  );
};

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  function handleChange(event) {
    setNewName(event.target.value);
  }

  // NOTE: As written, this function has a bug: it doesn't prevent the user
  // from submitting an empty form. This is left as an exercise for developers
  // working through MDN's React tutorial.
  function handleSubmit(event) {
    event.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
          <br/>
          {props.location && props.location.mapURL && (
            <span>
              <a href={props.location.mapURL} target="_blank" rel="noreferrer">(map)</a> 
              &nbsp; | &nbsp; 
              <a href={props.location.smsURL}>(sms)</a>
            </span>
          )}
          <br/>
          <small>{props.latitude && props.longitude ? `${props.latitude}, ${props.longitude}` : ""}</small>
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        
        <Popup trigger={<button type="button" className="btn">Take Photo</button>} modal>
          <div>
            <WebcamCapture id={props.id} />
          </div>
        </Popup>

        <Popup trigger={<button type="button" className="btn">View Photo</button>} modal>
          <div>
            <ViewPhoto id={props.id} name={props.name} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
