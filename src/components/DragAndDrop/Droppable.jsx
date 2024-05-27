import { useDroppable } from "@dnd-kit/core";

export function Droppable({ id, type, children }) {

  const { active, over, isOver, setNodeRef } = useDroppable({ id, accepts: [type] });

  let className = '';
  if (active && over) {
    if (isOver && active.id !== over.id) {
      className = 'p-2 border-2 border-dashed border-gray-500';
    }
  }

  return (
    <div className={className} ref={setNodeRef}>
      {children}
    </div>
  );
}