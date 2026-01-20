import { useDraggable } from "@dnd-kit/core";

export function Draggable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {/* drag handle only */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab select-none px-2 rounded bg-slate-600 text-white inline-block"
      >
        ...
      </div>

      {children}
    </div>
  );
}
