import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./SideBar";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const storedElements = JSON.parse(localStorage.getItem("elements"));
    if (storedElements) {
      setElements(storedElements);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const dragNewElement = (e, type) => {
    setSelectedElement({ type: type });
    e.dataTransfer.setData("type", type);
    setDragging(true);
  };
  const dragSelectedElement = (e, element) => {
    setSelectedElement(element);
    e.dataTransfer.setData("type", element.type);
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setCoordinates({ x: clientX, y: clientY });
    setModalOpen(dragging);
    if (!dragging) {
      const index = elements.findIndex(
        (item) =>
          item.XCoord === selectedElement.XCoord &&
          item.YCoord === selectedElement.YCoord
      );
      if (index > -1) {
        let obj = elements[index];
        if (obj) {
          const filteredElements = elements.filter(
            (item) => item.XCoord !== obj.XCoord && item.YCoord !== obj.YCoord
          );
          obj["XCoord"] = clientX;
          obj["YCoord"] = clientY;
          setElements([...filteredElements, obj]);
        }
      }
    }
  };

  const handleSaveConfig = (config) => {
    config.event.preventDefault();
    let title;
    let XCoord;
    let YCoord;
    let fontSize;
    let fontWeight;
    let type;
    let droppedXCoord;
    let droppedYCoord;
    const formData = config.event.target;
    if (selectedElement.hasOwnProperty("title")) {
      title = formData[0].value;
      XCoord = formData[1].value;
      YCoord = formData[2].value;
      fontSize = formData[3].value;
      fontWeight = formData[4].value;
      if (!title || title.trim() === "") {
        title = selectedElement.title;
      }
      if (isNaN(XCoord) || (!XCoord && XCoord !== 0)) {
        XCoord = selectedElement.XCoord;
      } else if (+XCoord <= 73) {
        XCoord = XCoord + "vw";
      }

      if (+XCoord > 73) XCoord = selectedElement.XCoord;
      if (+YCoord > 96) YCoord = selectedElement.YCoord;

      if (isNaN(YCoord) || (!YCoord && YCoord !== 0)) {
        YCoord = selectedElement.YCoord;
      } else if (+YCoord <= 96) {
        YCoord = YCoord + "vh";
      }
      if (isNaN(fontSize) || !fontSize) {
        fontSize = selectedElement.fontSize;
      }
      if (isNaN(fontWeight) || !fontWeight) {
        fontWeight = selectedElement.fontWeight;
      }
      type = selectedElement.type;
    } else {
      title = formData[0].value;
      XCoord = formData[1].value;
      YCoord = formData[2].value;
      fontSize = formData[3].value + "px";
      fontWeight = formData[4].value;
      type = config.type;
      droppedXCoord = config.x;
      droppedYCoord = config.y;

      if (!title || title.trim() === "") {
        title = type;
      }
      if (isNaN(XCoord) || (!XCoord && XCoord !== 0)) {
        XCoord = droppedXCoord + "px";
      } else if (+XCoord <= 73) {
        XCoord = XCoord + "vw";
      }

      if (+XCoord > 73) XCoord = 73 + "vw";
      if (+YCoord > 96) YCoord = 96 + "vh";

      if (isNaN(YCoord) || (!YCoord && YCoord !== 0)) {
        YCoord = droppedYCoord + "px";
      } else if (+YCoord <= 96) {
        YCoord = YCoord + "vh";
      }
      if (isNaN(fontSize) || !fontSize) {
        fontSize = "16px";
      }
      if (isNaN(fontWeight) || !fontWeight) {
        fontWeight = "300";
      }
    }

    const obj = {
      title: title,
      type: type,
      fontWeight: fontWeight,
      fontSize: fontSize,
      XCoord: XCoord,
      YCoord: YCoord,
    };

    if (selectedElement.hasOwnProperty("title")) {
      const filteredElements = elements.filter(
        (item) =>
          item.XCoord !== selectedElement.XCoord &&
          item.YCoord !== selectedElement.YCoord
      );
      setElements([...filteredElements, obj]);
    } else {
      setElements([...elements, obj]);
    }

    setModalOpen(false);
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };
  const handleKeyPress = (e, element) => {
    if (e.key === "Enter") {
      setModalOpen(true);
    } else if (e.key === "Delete") {
      deleteElement(element);
    }
  };

  const deleteElement = (element) => {
    const updatedElements = elements.filter(
      (el) => el.XCoord !== element.XCoord && el.YCoord !== element.YCoord
    );
    setElements(updatedElements);
    setSelectedElement(null);
  };

  return (
    <div className="app">
      <div
        className="page"
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => {
          let event = e;
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        {elements.map((element, index) => (
          <div
            tabIndex="0"
            onKeyDown={(e) => {
              handleKeyPress(e, element);
            }}
            id={index}
            draggable
            key={index}
            className={`page-element ${
              selectedElement === element ? "selected" : ""
            }`}
            style={
              selectedElement === element
                ? {
                    position: "absolute",
                    left: element.XCoord,
                    top: element.YCoord,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    width: "fit-content",
                    display: "block",
                    border: "2px solid red",
                  }
                : {
                    position: "absolute",
                    left: element.XCoord,
                    top: element.YCoord,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    width: "fit-content",
                    display: "block",
                  }
            }
            onClick={() => handleElementClick(element)}
            onDragStart={(e) => dragSelectedElement(e, element)}
          >
            {element.title}
          </div>
        ))}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="my-modal">
              <div className="edit-div">
                Edit{" "}
                {selectedElement.type.charAt(0).toUpperCase() +
                  selectedElement.type.slice(1)}
              </div>
              <form
                onSubmit={(e) =>
                  handleSaveConfig({
                    x: coordinates.x,
                    y: coordinates.y,
                    type: selectedElement.type,
                    event: e,
                  })
                }
              >
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    Text
                  </label>
                  <input type="text" className="form-control" id="text" />
                </div>
                <div className="mb-3">
                  <label htmlFor="X" className="form-label">
                    X
                  </label>
                  <input type="text" className="form-control" id="X" />
                </div>
                <div className="mb-3">
                  <label htmlFor="Y" className="form-label">
                    Y
                  </label>
                  <input type="text" className="form-control" id="Y" />
                </div>
                <div className="mb-3">
                  <label htmlFor="font-size" className="form-label">
                    Font Size
                  </label>
                  <input type="text" className="form-control" id="font-size" />
                </div>
                <div className="mb-3">
                  <label htmlFor="font-weight" className="form-label">
                    Font Weight
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="font-weight"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Sidebar dragNewElement={dragNewElement} />
    </div>
  );
}

export default App;
