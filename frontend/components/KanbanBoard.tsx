"use client";

import { useEffect, useState } from "react";

export default function KanbanBoard({
  currentKanban,
}: {
  currentKanban: string;
}) {
  interface Column {
    id: string;
    column_title: string;
    user_id: string;
    kanban_id: string;
  }
  const [columns, setColumns] = useState<Column[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/columns")
      .then((x) => x.json())
      .then((textData) => {
        console.log("textData ", textData["columns"]);
        console.log("current Kanban: ", currentKanban);
        const cols = [];
        for (const col of textData["columns"]) {
          if (col.kanban_id == currentKanban) {
            console.log("Pushing Col: ", col);
            cols.push(col);
          }
        }
        setColumns(cols);
      });
  }, []);
  return (
    <>
      <h1 className="mt-5 mb-5 pt-8 text-5xl font-bold">
        My Kanban Board {currentKanban}
      </h1>
      <div>
        <ul className="grid grid-cols-3">
          {columns.map((col, index) => (
            <li key={index}>
              <div className="border-2 border-b-cyan-100 p-3">
                {col.column_title}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
