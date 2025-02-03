import { useState, useRef, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import Draggable from "react-draggable";
import Column from "./columnDrag";

const GridTable = ({ table, onRemove, onUpdatePosition, onConnect }) => {
    const nodeRef = useRef(null);
    const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
    // const position = table?.position || { x: 0, y: 0 };
    const [size, setSize] = useState({ width: 200, height: 150 });
    const [isResizing, setIsResizing] = useState(false);
    const [isColumnDragging, setIsColumnDragging] = useState(false);

    const handleDragStop = (e, data) => {
        const newX = Math.max(bounds.left, Math.min(data.x, bounds.right));
        const newY = Math.max(bounds.top, Math.min(data.y, bounds.bottom));
        onUpdatePosition(table.id, { x: newX, y: newY });
    };

    useEffect(() => {
        const gridElement = document.querySelector(".grid");
        if (gridElement) {
            const gridRect = gridElement.getBoundingClientRect();
            setBounds({
                left: 0,
                top: 0,
                right: gridRect.width - size.width,
                bottom: gridRect.height - size.height,
            });
        }
    }, [size]);
    return (
        <Draggable
            position={{
                x: Math.min(Math.max(table.position.x, bounds.left), bounds.right),
                y: Math.min(Math.max(table.position.y, bounds.top), bounds.bottom),

            }}
            onStop={handleDragStop}
            bounds={bounds}
            nodeRef={nodeRef}
            disabled={isResizing || isColumnDragging}
        >
            <div className="grid_table" data-table-id={table.id} ref={nodeRef} style={{
                position: 'absolute',
                // left: `${position?.x}px`,
                // top: `${position?.y}px`,
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