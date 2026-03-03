import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App tasks={DATA} />
  </StrictMode>
);
