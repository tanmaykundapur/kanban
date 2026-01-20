"use client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "../components/Draggable";
import { Droppable } from "../components/Droppable";

export default function Home() {
  const [items, setItems] = useState([{ id: "1", title: "Task 1" }]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(`Dragged ${active.id} over ${over?.id}`);
  };

  return (
    <div>
      <div>Kanban Board</div>

      <DndContext onDragEnd={handleDragEnd}>
        <Draggable id="draggable-1">Task 1</Draggable>
        <Droppable id="droppable-1">Drop here</Droppable>
      </DndContext>
    </div>
  );
}
