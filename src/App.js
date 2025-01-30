import { useEffect, useState } from "react";
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.scss';
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
    // const exists = gridTables.some((table) => table.id === item.id);
    const newItem = {
      ...item,
      position: {
        x: offset.x,  // Store the X coordinate of the drop
        y: offset.y,  // Store the Y coordinate of the drop
      },
    };
    setGridTables((prevItems) => [...prevItems, newItem]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = gridTables.filter((data) => Number(data.id) !== Number(index))
    setGridTables(updatedItems);
  };
  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'table',
  //   drop: (item) => handleDrop(item),
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),
  // }));
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="sidebar">
          {tableData.map((table) =>
            <SideTable table={table} key={table.id} />
          )}
        </div>
        <div className="grid">
          {gridTables.length !== 0 && gridTables.map((table) => (
            <GridTable onDrop={handleDrop} key={table.id} table={table} onRemove={() => handleRemoveItem(table.id)} />
          ))}
          <GridTable onDrop={handleDrop} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
