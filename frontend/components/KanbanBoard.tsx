"use client";

import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { FormEvent, useEffect, useState } from "react";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

export default function KanbanBoard({
  currentKanban,
}: {
  currentKanban: string;
}) {
  interface Column {
    column_id: string | number;
    column_title: string;
    user_id?: string;
    kanban_id?: string;
    tasks?: Array<{ task_id: string; task_content: string }>;
  }
  interface KanbanData {
    columns: Record<
      string,
      Column & { tasks?: Array<{ task_id: string; task_content: string }> }
    >;
  }
  const [kanban, setKanban] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [droppedCol, setDroppedCol] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  async function resetKanban() {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/kanban/${currentKanban}`);
      const data = await res.json();
      setKanban(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    resetKanban();
  }, [currentKanban]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const task = String(formData.get("task"));
    console.log("Task: ", task);
    const response = await fetch(
      `http://localhost:8000/task/${currentKanban}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_content: task }),
      },
    );
    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      console.error("Error:", data);
    }
    resetKanban();
  };

  const handleDelete = async (task_id: number) => {
    console.log("Deleting Task...");
    const response = await fetch(`http://localhost:8000/task/${task_id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Error:", data);
    }
    resetKanban();
  };

  const handleDragStart = async (e: any) => {
    console.log("Active ID: ", e.active.id);
    setActiveTask(e.active.id);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!overId.startsWith("col-")) return;

    const taskId = activeId.replace("task-", "");
    const columnId = overId.replace("col-", "");

    console.log("Dropped task", taskId, "into column ", columnId);

    await fetch(`http://localhost:8000/task/${taskId}/${columnId}`, {
      method: "POST",
    });

    resetKanban();
  };

  // Before Kanban Loads
  if (loading) return <div className="m-50">Loading...</div>;
  if (!kanban) return <div className="m-50">No Kanban...</div>;

  return (
    <>
      <h1 className="mt-5 mb-5 pt-8 text-5xl font-bold">
        My Kanban Board {currentKanban}
      </h1>
      <div>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <ul className="grid grid-cols-3">
            {Object.values(kanban?.columns).map((col, index) => (
              <li
                key={col.column_id || index} // Fallback key
                className="flex flex-col min-w-0 p-3 border-2 border-b-cyan-400 h-full"
              >
                <h1 className="mb-2">{col.column_title}</h1>

                <Droppable id={`col-${col.column_id}`} className="flex-1">
                  {col.tasks?.map((task) => (
                    <Draggable id={`task-${task.task_id}`} key={task.task_id}>
                      <div className="group relative flex flex-row items-start justify-between bg-white p-4 mb-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none">
                        {/* Task Content */}
                        <p className="text-gray-700 text-sm font-medium leading-snug flex-1 mr-2 break-all">
                          {task.task_content}
                        </p>

                        {/* Delete Button (Only visible on Hover) */}
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => handleDelete(parseInt(task.task_id))}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Delete task"
                        >
                          X
                        </button>
                      </div>
                    </Draggable>
                  ))}
                </Droppable>
              </li>
            ))}
          </ul>
        </DndContext>
      </div>
      <form method="POST" onSubmit={handleSubmit} className="flex flex-row">
        <input
          className="mt-5 m-2 p-2.5 w-full text-lg resize-none overflow-hidden whitespace-nowrap text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          name="task"
          placeholder="Type your task here..."
        ></input>
        <button
          type="submit"
          className="flex-row mt-5 m-2 p-2.5 px-8 border-2 bg-blue-500 rounded-lg"
        >
          Add
        </button>
      </form>
    </>
  );
}
