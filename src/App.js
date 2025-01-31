import { useEffect, useState } from "react";
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sideBarData } from "./tableData";
import SideTable from "./components/dragItem";
import GridTable from "./components/dropZone";

function App() {
  const [tableData, setTableData] = useState([]);
  const [gridTables, setGridTables] = useState([]);

  useEffect(() => {
    setTableData(sideBarData);
  }, [])

  const handleDrop = (item, offset) => {
    if (!offset) return;
    const isAlreadyAdded = gridTables.some((table) => table.id === item.id);
    const gridRect = document.querySelector(".grid").getBoundingClientRect();
    const newItem = {
      ...item,
      position: {
        x: offset.x - gridRect.left,
        y: offset.y - gridRect.top,
      },
    };
    if (isAlreadyAdded) {
      toast.error(`${item.name} already exists`)
    } else {
      setGridTables((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = gridTables.filter((data) => Number(data.id) !== Number(index))
    setGridTables(updatedItems);
  };
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "table",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      handleDrop(item, offset);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleUpdatePosition = (id, newPosition) => {
    setGridTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, position: newPosition } : table
      )
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="sidebar">
          {tableData.map((table) =>
            <SideTable table={table} key={table.id} addedTables={gridTables} />
          )}
        </div>
        <div className="grid" ref={drop}>
          {gridTables.length !== 0 && gridTables.map((table) => {
            return <GridTable key={table.id} table={table} onRemove={() => handleRemoveItem(table.id)} onUpdatePosition={handleUpdatePosition} />
          })}
          {/* <GridTable onDrop={handleDrop} /> */}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
