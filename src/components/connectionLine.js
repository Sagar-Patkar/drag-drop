import React, { useEffect, useRef, useState } from "react";

const ConnectionLines = ({ connections, tables }) => {
    const gridRef = useRef(null);

    const getTablePosition = (tableId) => {
        const table = tables.find((t) => t.id === tableId);
        if (table) {
            const tableElement = document.querySelector(`[data-table-id='${tableId}']`);
            if (tableElement) {
                const rect = tableElement.getBoundingClientRect();
                const gridRect = gridRef.current.getBoundingClientRect();
                return {
                    x: rect.left - gridRect.left + rect.width / 2,
                    y: rect.top - gridRect.top + rect.height / 2,
                };
            }
        }
        return null;
    };

    return (
        <svg
            ref={gridRef}
            className="connection-lines"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            {connections.map((connection, index) => {
                const fromPos = getTablePosition(connection.from);
                const toPos = getTablePosition(connection.to);

                if (fromPos && toPos) {
                    return (
                        <line
                            key={index}
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            stroke="black"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                    );
                }
                return null;
            })}
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
        </svg>
    );
};

export default ConnectionLines;
