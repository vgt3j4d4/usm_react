import { useMemo, useState } from "react";
import { NOTE_TYPE } from "../../const";
import { useRef } from "react";
import { useEffect } from "react";
import * as utils from "../../utils/utils";

export function Note({
  id, title, type, selected = false, isFirst = false,
  select, updateTitle, remove
}) {
  const [editing, setEditing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (editing) {
      const noteEl = titleRef.current;
      noteEl.focus();
      utils.selectText(noteEl);
    }
  }, [editing]);

  function startEditing() {
    setEditing(true);
  }

  function stopEditing() {
    setEditing(false);
    const editedTitle = titleRef.current.innerText;
    if (editedTitle !== title) updateTitle(editedTitle);
  }

  function doKeyboardAction(e) {
    if (e && e.key && e.key === 'Enter') {
      e.preventDefault();
      if (editing) stopEditing()
      else startEditing();
    }
    if (e && e.key && e.key === 'Delete') {
      if (!editing) remove();
    }
  }

  function getClassName(type, selected) {
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

    return className;
  }

  const className = useMemo(() => getClassName(type, selected), [type, selected]);

  return (
    <div role="gridcell" tabIndex={isFirst || selected ? '0' : '-1'}
      data-note-id={id}
      className={className}
      onFocus={select}
      onClick={select}
      onDoubleClick={startEditing}
      onKeyDown={doKeyboardAction}
      aria-selected={selected}>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className={editing ? 'ring-0 outline-none' : 'hidden'}
          ref={titleRef}
          contentEditable={editing} suppressContentEditableWarning={true}
          onKeyDown={doKeyboardAction}
          onBlur={stopEditing}>{title}</span>
        <span className={editing ? 'hidden' : ''}>{title}</span>
      </span>
    </div>
  )
}