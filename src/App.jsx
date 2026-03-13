import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

// 自定义 Hook：保存前一个值
function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 自定义 Hook：持久化状态到 localStorage
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

// 过滤器映射
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  // State 声明
  const [tasks, setTasks] = usePersistedState("tasks-w06", props.tasks);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");

  // Refs 声明
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  // 任务操作函数
  // 回调函数：添加新任务（传递给 Form 组件）
  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = { 
      id: id, 
      name: name, 
      completed: false,
      location: { latitude: "##", longitude: "##", error: "##" } 
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }

  // 回调函数：切换任务完成状态（传递给 Todo 组件）
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // 如果任务 ID 匹配，则切换完成状态
      if (id === task.id) {
        // 返回一个新的任务对象，切换 completed 属性
        // 使用展开运算符保留其他属性不变
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  // 回调函数：删除任务（传递给 Todo 组件）
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    localStorage.setItem("tasks-w06", JSON.stringify(remainingTasks));
  }

  // 回调函数：编辑任务名称（传递给 Todo 组件）
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  // 照片功能
  // 回调函数：标记任务已拍照（传递给 Todo 组件）
  function photoedTask(id) {
    const photoedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, photo: true };
      }
      return task;
    });
    setTasks(photoedTaskList);
  }

  // 地理位置功能
  function locateTask(id, location) {
    const locatedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, location: location };
      }
      return task;
    });
    setTasks(locatedTaskList);
  }

  // 回调函数：获取地理位置（传递给 Form 组件）
  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locateTask(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
      mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      smsURL: `sms:?body=I am at ${latitude}, ${longitude}`
    });
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  // 生成任务列表（传递多个回调函数给 Todo 组件）adding tasks to the list and passing callbacks to each Todo component for toggling, deleting, editing, and marking as photoed
  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        location={task.location}
        latitude={task.location?.latitude}
        longitude={task.location?.longitude}
        photoedTask={photoedTask}           // 回调：标记已拍照
        toggleTaskCompleted={toggleTaskCompleted}  // 回调：切换完成状态
        deleteTask={deleteTask}             // 回调：删除任务
        editTask={editTask}                 // 回调：编辑任务
      />
    ));

  // 生成过滤按钮列表（传递回调函数给 FilterButton 组件）
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}  // 回调：设置过滤器
    />
  ));

  // 计算剩余任务数
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  // 焦点管理
  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>W06 TodoMatic</h1>
      {/* 通过 props 传递回调函数 addTask 和 geoFindMe 给 Form 组件 */}
      <Form addTask={addTask} geoFindMe={geoFindMe} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;

