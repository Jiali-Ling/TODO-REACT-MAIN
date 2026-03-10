import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// eslint-disable-next-line react-refresh/only-export-components
const DATA = [
  { 
    id: "todo-0", 
    name: "I'M IN SAN FRANCISCO", 
    completed: false,
    location: { latitude: 37.774929, longitude: -122.419416, error: "" }
  },
  { 
    id: "todo-1", 
    name: "I'M IN LONDON", 
    completed: false,
    location: { latitude: 51.507351, longitude: -0.127758, error: "" }
  },
  { 
    id: "todo-2", 
    name: "I'M IN MOSCOW", 
    completed: false,
    location: { latitude: 55.755826, longitude: 37.6173, error: "" }
  },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tasks={DATA} />
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW registration failed:", err));
  });
}

