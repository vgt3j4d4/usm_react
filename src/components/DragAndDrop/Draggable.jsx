import { useDraggable } from "@dnd-kit/core";

export function Draggable({ id, type, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({ id, data: { type }, attributes: { role: 'none', tabIndex: -1 } });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}