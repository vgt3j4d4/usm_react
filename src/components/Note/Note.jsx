import { useMemo } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../../const";
import { useNote } from "../../hooks/useNote";
import { focusNoteById } from "../../utils/storyMapUtils";

export function Note({
  id, title, type,
  focusable = false, selected = false,
  toggleFocus, markAsSelected, updateTitle, add, remove, navigate
}) {
  const { editing, setEditing, titleRef } = useNote(false);

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

  function maybeDoAction(e) {
    if (!e || !e.key) return;

    switch (e.key) {
      case 'F2':
        startEditing(e);
        break;
      case '+':
        add();
        break;
      case 'Delete':
        remove();
        break;
      case ARROW_KEYS.UP:
      case ARROW_KEYS.DOWN:
      case ARROW_KEYS.LEFT:
      case ARROW_KEYS.RIGHT:
        if (!editing) navigate(e.key);
        break;
      default:
        break;
    }
  }

  function maybeStopEditingDueToKeyStroke(e) {
    if (!e || !e.key) return;

    if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault(); // prevent default behavior of Enter and Tab
      setEditing(false);
      if (e.key === 'Escape') titleRef.current.innerText = title;
      focusNoteById(id);
    }
  }

  function stopEditing(e) {
    setEditing(false);
    if (titleRef.current.innerText !== title) updateTitle(titleRef.current.innerText);
    // if focus is moving to somewhere within the same note, then focus
    if (e.relatedTarget && e.relatedTarget.contains(titleRef.current)) focusNoteById(id);
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
      onKeyDown={maybeDoAction}
      aria-selected={selected}>
      <span className="note__content">
        <span className={editing ? 'outline-none' : 'hidden'}
          ref={titleRef}
          contentEditable={editing} suppressContentEditableWarning={true}
          tabIndex={editing ? '0' : '-1'}
          onKeyDown={maybeStopEditingDueToKeyStroke}
          onBlur={stopEditing}>
          {title}
        </span>
        <span className={editing ? 'hidden' : 'select-none hover:cursor-text'} onClick={startEditing}>{title}</span>
      </span>
    </div>
  )
}