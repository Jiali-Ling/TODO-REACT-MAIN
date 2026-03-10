import { useState, useEffect } from "react";

// Form 组件 - 用于添加新的待办事项
// props.addTask: 回调函数，用于将新任务添加到任务列表
// props.geoFindMe: 回调函数，用于获取地理位置
function Form(props) {
  const [name, setName] = useState("");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe(); // 调用父组件传递的地理位置回调
      setAddition(false);
    }
  }, [addition, props]);

  // 处理表单提交
  function handleSubmit(event) {
    event.preventDefault();
    // 验证输入不为空
    if (!name.trim()) {
      return;
    }
    // 调用父组件传递的回调函数 addTask
    props.addTask(name);
    setAddition(true);
    setName("");
  }

  // 处理输入变化 Reading user input
  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
