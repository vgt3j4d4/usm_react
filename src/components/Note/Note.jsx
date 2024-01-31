import { NOTE_TYPE } from "../../const";

export function Note({ id, title, type, selected = false, select, isFirst = false }) {
  let className = 'note';

  switch (type) {
    case NOTE_TYPE.EPIC:
      className += ' bg-orange-300';
      break;
    case NOTE_TYPE.FEATURE:
      className += ' bg-cyan-300';
      break;
    case NOTE_TYPE.STORY:
      className += ' bg-yellow-300';
      break;
    default:
      break;
  }

  if (selected) className += ' border-2 border-black transition';

  return (
    <div role="gridcell" tabIndex={isFirst || selected ? '0' : '-1'}
      data-note-id={id}
      className={className}
      onFocus={select}
      onClick={select}
      aria-selected={selected}>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">{title}</span>
    </div>
  )
}