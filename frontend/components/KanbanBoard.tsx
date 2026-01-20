"use client";

import { DndContext, pointerWithin } from "@dnd-kit/core";
import { FormEvent, useEffect, useState } from "react";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

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

    // Check if the response was successful
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

  const handleDragEnd = async (e: any) => {
    if (!e.over) return; // dropped outside
    const taskId = String(e.active.id).replace("task-", "");
    const columnId = String(e.over?.id).replace("col-", "");
    console.log("over:", e.over, "collisions:", e.collisions);

    console.log("Dropped task", taskId, "into col", columnId);

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
          collisionDetection={pointerWithin}
        >
          <ul className="grid grid-cols-3">
            {Object.values(kanban?.columns).map((col, index) => (
              <li
                key={col.id}
                className="flex flex-col min-w-0 p-3 border-2 border-b-cyan-400"
              >
                <h1 className="mb-2">{col.column_title}</h1>
                <Droppable id={`col-${col.id}`}>
                  {col.tasks?.map((task) => (
                    // TASK
                    <Draggable id={`task-${task.task_id}`} key={task.task_id}>
                      <div className="flex flex-row border-2 p-3 bg-sky-700 hover:bg-sky-900 m-1">
                        <p>{task.task_content}</p>
                        <button
                          onClick={() => handleDelete(parseInt(task.task_id))}
                          className="px-2 ml-auto rounded-4xl border-2 bg-red-400 hover:bg-red-500 select-none"
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
