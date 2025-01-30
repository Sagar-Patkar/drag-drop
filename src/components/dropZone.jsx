import React from 'react';
import { useDrop } from 'react-dnd';
import { IoMdClose } from "react-icons/io";

const GridTable = ({ onDrop, table, onRemove }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "table",
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            console.log('Sagar 1', item);
            onDrop(item, offset)
        },  // Call the drop function when something is dropped
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    const position = table?.position || { x: 0, y: 0 };
    return (
        <div ref={drop} className="grid_table" style={{
            position: 'absolute',
            backgroundColor: isOver ? "lightblue" : "white",
            left: `${position?.x}px`,
            top: `${position?.y}px`,
            width: "200px",
            height: "150px"
        }}>
            <div div className="grid_table_header" > {table?.name} {table && <span onClick={() => onRemove()} style={{ cursor: 'pointer' }}><IoMdClose /></span>}</div>
            {
                table?.columns.map((column) => {
                    return (
                        <div className="grid_table_column" key={column.column_id}>{column.name} {column.column_data_type}</div>
                    )
                })
            }
        </div>
    )
}

export default GridTable;