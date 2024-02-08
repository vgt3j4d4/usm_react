import { useEffect, useMemo, useRef, useState } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../../const";
import * as utils from "../../utils/utils";

export function Note({
  id, title, type, selected = false, isFirst = false,
  toggleFocus, markAsSelected, updateTitle, add, remove, navigate
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

  function focusNote(e) {
    toggleFocus(e.target !== titleRef.current);
    markAsSelected();
  }

  function defocusNote() {
    toggleFocus(false);
  }

  function startEditing(e) {
    e.stopPropagation();
    setEditing(true);
    toggleFocus(false);
  }

  function stopEditing(e) {
    e.stopPropagation();
    setEditing(false);
    const editedTitle = titleRef.current.innerText;
    updateTitle(editedTitle);
  }

  function maybeTriggerKeyboardAction(e) {
    if (!e || !e.key) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (editing) stopEditing(e)
      else startEditing(e);
      return;
    }
    if (e.key === 'Escape') {
      if (editing) stopEditing(e);
      return;
    }
    if (e.key === '+') {
      if (!editing) add();
      return;
    }
    if (e.key === 'Delete') {
      if (!editing) remove();
      return;
    }

    if (Object.values(ARROW_KEYS).includes(e.key)) {
      e.preventDefault();
      navigate(e.key);
      return;
    }

    if (Object.values(ARROW_KEYS).includes(e.key)) {
      navigate(e.key);
      return;
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
      onFocus={focusNote}
      onBlur={defocusNote}
      onClick={markAsSelected}
      onKeyDown={maybeTriggerKeyboardAction}
      aria-selected={selected}>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className={editing ? 'ring-0 outline-none' : 'hidden'}
          ref={titleRef}
          contentEditable={editing} suppressContentEditableWarning={true}
          tabIndex={editing ? "0" : "-1"}
          onKeyDown={maybeTriggerKeyboardAction}
          onBlur={stopEditing}>
          {title}
        </span>
        <span className={editing ? 'hidden' : 'hover:cursor-text'} onClick={startEditing}>{title}</span>
      </span>
    </div>
  )
}