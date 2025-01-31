import { useState, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import Draggable from "react-draggable";
import Column from "./columnDrag";

const GridTable = ({ table, onRemove, onUpdatePosition, onConnect }) => {
    const nodeRef = useRef(null);
    const position = table?.position || { x: 0, y: 0 };
    const [size, setSize] = useState({ width: 200, height: 150 });
    const [isResizing, setIsResizing] = useState(false);
    const [isColumnDragging, setIsColumnDragging] = useState(false);

    const handleDragStop = (e, data) => {
        onUpdatePosition(table.id, { x: data.x, y: data.y });
    };

    const gridWidth = (window.innerWidth * 0.75);
    const gridHeight = window.innerHeight;

    const bounds = {
        left: 0,
        top: 0,
        right: gridWidth - size.width,
        bottom: gridHeight - size.height,
    };
    return (
        <Draggable
            position={{ x: position.x, y: position.y }}
            onStop={handleDragStop}
            bounds={bounds}
            nodeRef={nodeRef}
            disabled={isResizing || isColumnDragging}
        >
            <div className="grid_table" data-table-id={table.id} ref={nodeRef} style={{
                position: 'absolute',
                left: `${position?.x}px`,
                top: `${position?.y}px`,
                // width: "200px",
                // height: "150px"
            }}>
                <ResizableBox
                    width={size.width}
                    height={size.height}
                    minConstraints={[150, 100]}
                    maxConstraints={[400, 300]}
                    onResizeStop={(event, { size }) => { setSize(size); setIsResizing(false) }}
                    onResizeStart={(e) => { e.stopPropagation(); setIsResizing(true) }}
                    className="resizable_box"
                >
                    <div className='grid_table_content'>
                        <div div className="grid_table_header" > {table?.name} {table && <span onClick={() => onRemove()} style={{ cursor: 'pointer' }}><IoMdClose /></span>}</div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Data Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    table?.columns.map((column) => (
                                        <Column
                                            key={column.column_id}
                                            column={column}
                                            tableId={table.id}
                                            onConnect={onConnect}
                                            setIsColumnDragging={setIsColumnDragging}
                                        />
                                    )
                                    )
                                }
                            </tbody>
                        </table>

                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    )
}

export default GridTable;