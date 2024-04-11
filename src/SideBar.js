import React from "react";
import SideBarElement from "./SideBarElement";
import "./App.css";

function Sidebar({ dragNewElement }) {
  const handleDragStart = (e, type) => {
    dragNewElement(e, type);
  };

  const sideBarElements = ["Label", "Input", "Button"];

  return (
    <div className="sidebar">
      <p className="paragraph">BLOCKS</p>
      {sideBarElements.map((item) => (
        <SideBarElement title={item} handleDragStart={handleDragStart} />
      ))}
    </div>
  );
}

export default Sidebar;
