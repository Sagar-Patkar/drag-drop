import React from "react";
import { useDrag, useDrop } from 'react-dnd';

const Column = ({ column, tableId, onConnect, setIsColumnDragging }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "column",
        item: () => {
            setIsColumnDragging(true);
            return { columnId: column.column_id, tableId }
        },
        end: () => setIsColumnDragging(false),
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "column",
        drop: (item) => {
            onConnect(
                { tableId: item.tableId, columnId: item.columnId },
                { tableId, columnId: column.column_id }
            );
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <tr
            ref={(node) => {
                drag(node);
                drop(node);
            }}
            className="grid_table_column"
            style={{
                background: isOver ? "#f0f0f0" : "transparent",
                cursor: "grab",
            }}
        >
            <td>{column.name}</td>
            <td>{column.column_data_type}</td>
        </tr>
    );
};

export default Column;