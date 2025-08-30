import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="container">
      <div className="card">
        <span className="badge">Silococene Blessing</span>
        <App />
      </div>
    </div>
  </React.StrictMode>
);
