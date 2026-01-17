"use client";

import { FormEvent, useEffect, useState } from "react";

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
  useEffect(() => {
    async function loadKanban() {
      try {
        setLoading(true);
        fetch(`http://localhost:8000/kanban/${currentKanban}`)
          .then((x) => x.json())
          .then((textData) => {
            console.log("Fetching Kanban...");
            console.log("Text Data: ", textData);
            setKanban(textData);
          });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadKanban();
  }, [currentKanban]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const task = formData.get("task");
    console.log("Task: ", task);
    const response = await fetch(
      `http://localhost:8000/task/${currentKanban}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      },
    );
    const data = await response.json();
    console.log("Response Data:", data);

    // Check if the response was successful
    if (!response.ok) {
      console.error("Error:", data);
    }
  };

  if (loading) return <div className="m-50">Loading...</div>;
  if (!kanban) return <div className="m-50">No Kanban...</div>;

  return (
    <>
      <h1 className="mt-5 mb-5 pt-8 text-5xl font-bold">
        My Kanban Board {currentKanban}
      </h1>
      <div>
        <ul className="grid grid-cols-3">
          {Object.values(kanban?.columns).map((col, index) => (
            <li key={index}>
              <div className="border-2 border-b-cyan-100 p-3">
                <h1 className="mb-2">{col.column_title}</h1>
                {col.tasks?.map((task) => (
                  <div
                    className="border-2 p-3 bg-sky-700 hover:bg-sky-900"
                    key={task.task_id}
                  >
                    {task.task_content}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
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
