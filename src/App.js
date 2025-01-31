import { useEffect, useState } from "react";
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sideBarData } from "./tableData";
import SideTable from "./components/dragItem";
import GridTable from "./components/dropZone";
import ConnectionLines from "./components/connectionLine";

function App() {
  const [tableData, setTableData] = useState([]);
  const [gridTables, setGridTables] = useState([]);
  const [connections, setConnections] = useState([]);

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

  // const handleConnection = (from, to) => {
  //   const sourceTable = gridTables.find((table) => table.id === from.tableId);
  //   const targetTable = gridTables.find((table) => table.id === to.tableId);

  //   if (sourceTable && targetTable) {
  //     const columnToMove = sourceTable.columns.find(col => col.column_id === from.columnId);
  //     if (columnToMove) {
  //       const updatedSourceColumns = sourceTable.columns.filter(col => col.column_id !== from.columnId);
  //       const updatedTargetColumns = [...targetTable.columns, columnToMove];

  //       setGridTables(prevTables => prevTables.map((table) => {
  //         if (table.id === sourceTable.id) {
  //           return { ...table, columns: updatedSourceColumns };
  //         } else if (table.id === targetTable.id) {
  //           return { ...table, columns: updatedTargetColumns };
  //         }
  //         return table;
  //       }));
  //     }
  //   }
  //   // setConnections((prevConnections) => [...prevConnections, { from, to }]);
  // };

  const handleConnection = (from, to) => {
    setGridTables((prevTables) => {
      const sourceTable = prevTables.find((table) => table.id === from.tableId);
      const targetTable = prevTables.find((table) => table.id === to.tableId);

      if (!sourceTable || !targetTable) return prevTables;
      const columnToMove = sourceTable.columns.find((col) => col.column_id === from.columnId);

      if (!columnToMove) return prevTables;
      const updatedSourceColumns = sourceTable.columns.filter((col) => col.column_id !== from.columnId);
      const updatedTargetColumns = [...targetTable.columns, columnToMove];
      setConnections((prevConnections) => [
        ...prevConnections,
        { from: sourceTable.id, to: targetTable.id },
      ]);
      return prevTables.map((table) => {
        if (table.id === sourceTable.id) {
          return { ...table, columns: updatedSourceColumns };
        } else if (table.id === targetTable.id) {
          return { ...table, columns: updatedTargetColumns };
        }
        return table;
      });
    });
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
          <ConnectionLines connections={connections} tables={gridTables} />
          {gridTables.length !== 0 && gridTables.map((table) => {
            return <GridTable key={table.id} table={table} onRemove={() => handleRemoveItem(table.id)} onUpdatePosition={handleUpdatePosition} onConnect={handleConnection} />
          })}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
