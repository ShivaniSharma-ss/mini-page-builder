import React from "react";
import "./App.css";

function SideBarElement({ handleDragStart, title }) {
  return (
    <div
      className="sidebar-element"
      draggable
      onDragStart={(e) => handleDragStart(e, title)}
    >
      <span className={title === "Button" ? "button-title" : "title"}>
        {title}
      </span>
      <div className="drag-indicator">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      <div className="drag-indicator">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default SideBarElement;
