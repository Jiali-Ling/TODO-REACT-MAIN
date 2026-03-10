import { useEffect, useRef, useState, useCallback } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db.jsx";

// 自定义 Hook：保存前一个值
function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Webcam 拍照组件
const WebcamCapture = (props) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgId, setImgId] = useState(null);
  const [photoSave, setPhotoSave] = useState(false);

  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      if (props.photoedTask) {
        props.photoedTask(imgId);
      }
      setPhotoSave(false);
    }
  }, [photoSave, imgId, props]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const savePhoto = (id, imgSrc) => {
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
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
          <button 
            type="button" 
            className="btn" 
            onClick={() => savePhoto(props.id, imgSrc)}
          >
            Save Photo
          </button>
        )}
        {imgSrc && (
          <button 
            type="button" 
            className="btn todo-cancel" 
            onClick={cancelPhoto}
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
};

// 查看照片组件
const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
  return (
    <div>
      {photoSrc ? (
        <img src={photoSrc} alt={props.name} />
      ) : (
        <p>No photo available</p>
      )}
    </div>
  );
};

// Todo 组件 - 显示单个待办事项
function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  // 处理输入变化
  function handleChange(e) {
    setNewName(e.target.value);
  }

  // 提交编辑
  function handleSubmit(e) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  // 编辑模板
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
          onClick={() => setEditing(false)}
        >
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

  // 查看模板
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
          {props.location && props.location.latitude && props.location.longitude && (
            <span>
              {" | la "}
              {props.location.latitude}
              {" lo "}
              {props.location.longitude}
              {" "}
            </span>
          )}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>

        <Popup 
          trigger={<button type="button" className="btn">Take Photo</button>} 
          modal
        >
          <div>
            <WebcamCapture id={props.id} photoedTask={props.photoedTask} />
          </div>
        </Popup>

        <Popup 
          trigger={<button type="button" className="btn">View Photo</button>} 
          modal
        >
          <div>
            <ViewPhoto id={props.id} name={props.name} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
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

  return <li className="todo stack-small">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;