import { useMemo } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../../const";
import { useNote } from "../../hooks/useNote";
import { focusNoteById } from "../../utils/storyMapUtils";

export function Note({
  id, title, type,
  focusable = false, selected = false,
  toggleFocus, markAsSelected, updateTitle, add, remove, navigate
}) {
  const { editing, setEditing, titleRef } = useNote();

  function focusNote(e) {
    toggleFocus(e.target !== titleRef.current);
    markAsSelected();
  }

  function defocusNote() {
    toggleFocus(false);
  }

  function maybeMarkAsSelected() {
    if (!selected) markAsSelected();
  }

  function startEditing(e) {
    e.stopPropagation();
    setEditing(true);
    toggleFocus(false);
  }

  function stopEditing(e, revert = false) {
    setEditing(false);

    let editedTitle;
    if (revert) {
      editedTitle = title;
      titleRef.current.innerText = title;
    } else {
      editedTitle = titleRef.current.innerText;
    }
    if (editedTitle !== title) updateTitle(editedTitle);

    if (!e.relatedTarget) { // onKeyDown
      focusNoteById(id);
    } else { // onBlur
      // only refocus if e.relatedTarget is within the current note
      if (e.relatedTarget.contains(titleRef.current)) {
        focusNoteById(id);
      }
    }
  }

  function maybeTriggerKeyboardAction(e) {
    if (!e || !e.key) return;

    if (e.key === 'F2') {
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

    if (Object.values(ARROW_KEYS).includes(e.key)) {
      if (!editing) navigate(e.key);
      return;
    }
  }

  function maybeTriggerTitleKeyboardAction(e) {
    if (!e || !e.key) return;

    if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      stopEditing(e, e.key === 'Escape');
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
    <div role="gridcell" tabIndex={(focusable || selected) ? '0' : '-1'}
      data-note-id={id}
      className={className}
      onFocus={focusNote}
      onBlur={defocusNote}
      onClick={maybeMarkAsSelected}
      onKeyDown={maybeTriggerKeyboardAction}
      aria-selected={selected}>
      <span className="note__content">
        <span className={editing ? 'outline-none' : 'hidden'}
          ref={titleRef}
          contentEditable={editing} suppressContentEditableWarning={true}
          tabIndex={editing ? '0' : '-1'}
          onKeyDown={maybeTriggerTitleKeyboardAction}
          onBlur={stopEditing}>
          {title}
        </span>
        <span className={editing ? 'hidden' : 'select-none hover:cursor-text'} onClick={startEditing}>{title}</span>
      </span>
    </div>
  )
}