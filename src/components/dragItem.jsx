import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { FaTable, FaColumns } from 'react-icons/fa';
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

const SideTable = ({ table }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'table',
        item: table,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));
    return (
        <div
            ref={drag}
            className="draggable_table"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="sideTable">
                <div onClick={() => setIsOpen(!isOpen)}><span className="dropDown">{isOpen ? <CiSquareMinus /> : <CiSquarePlus />}</span> <FaTable /> {table.name}</div>
                {isOpen && (
                    table.columns.map((data) => {
                        return <div key={data.id} className="sideColumn"><FaColumns /> {data.name}</div>
                    })
                )}
            </div>
        </div>
    )
}

export default SideTable;