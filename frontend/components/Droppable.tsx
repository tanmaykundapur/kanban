import { useDroppable } from "@dnd-kit/core";

export function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[250px] rounded-xl border-2 border-dashed p-3 transition-all
        ${isOver ? "border-blue-500 border-3 bg-blue-50" : "border-gray-300 bg-gray-50"}
      `}
    >
      {children}
    </div>
  );
}
