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
      if (noteEl) {
        noteEl.focus();
        utils.selectTextWithin(noteEl);
      }
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

  function stopEditing(e, revert = false) {
    e.stopPropagation();
    setEditing(false);

    let editedTitle;
    if (revert) {
      editedTitle = title;
      titleRef.current.innerText = title;
    } else {
      editedTitle = titleRef.current.innerText;
    }
    updateTitle(editedTitle);
  }

  function maybeTriggerKeyboardAction(e) {
    if (!e || !e.key) return;

    if (editing) {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault();
        stopEditing(e, e.key === 'Escape');
        return;
      }
    } else {
      if (e.key === 'F2') {
        e.preventDefault();
        startEditing(e);
        return;
      }
      if (e.key === '+') {
        add();
        return;
      }
      if (e.key === 'Delete') {
        remove();
        return;
      }
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
        className += ' note--epic';
        break;
      case NOTE_TYPE.FEATURE:
        className += ' note--feature';
        break;
      case NOTE_TYPE.STORY:
        className += ' note--story';
        break;
      default:
        break;
    }

    if (selected) className += ' note--selected';

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
      <span className="note__content">
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