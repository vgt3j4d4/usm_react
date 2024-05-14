import React, { useMemo } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../../const";
import { useNote } from "../../hooks/useNote";
import { focusNoteById } from "../../utils/storyMapUtils";

interface NoteComponentProps {
  id: string;
  title: string;
  type: string;
  focusable: boolean;
  selected: boolean;
  markAsSelected: () => void;
  updateTitle: (title: string) => void;
  add: () => void;
  remove: () => void;
  navigate: (key: string) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  titleRef: React.RefObject<HTMLSpanElement>;
  className: string;
}

class NoteComponent extends React.Component<NoteComponentProps> {

  constructor(props: NoteComponentProps) {
    super(props);
    this.focusNote = this.focusNote.bind(this);
    this.maybeMarkAsSelected = this.maybeMarkAsSelected.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.maybeDoAction = this.maybeDoAction.bind(this);
    this.maybeStopEditing = this.maybeStopEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
  }

  focusNote() {
    const { markAsSelected } = this.props;
    markAsSelected();
  }

  maybeMarkAsSelected() {
    const { selected, markAsSelected } = this.props;
    if (!selected) markAsSelected();
  }

  startEditing(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    this.props.setEditing(true);
  }

  maybeDoAction(e: React.KeyboardEvent) {
    if (!e || !e.key) return;

    const { add, remove, editing, navigate } = this.props;
    switch (e.key) {
      case "F2":
        this.startEditing(e);
        break;
      case "+":
        add();
        break;
      case "Delete":
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

  maybeStopEditing(e: React.KeyboardEvent) {
    if (!e || !e.key) return;

    const { id, title, setEditing, titleRef } = this.props;
    if (e.key === "Enter" || e.key === "Escape" || e.key === "Tab") {
      e.preventDefault(); // prevent default behavior of Enter and Tab
      setEditing(false);
      if (e.key === "Escape") titleRef.current!.innerText = title;
      focusNoteById(id);
    }
  }

  stopEditing(e: React.FocusEvent) {
    const { id, title, setEditing, titleRef, updateTitle } = this.props;
    setEditing(false);
    if (titleRef.current!.innerText !== title)
      updateTitle(titleRef.current!.innerText);
    const focusWithinSameNote =
      e.relatedTarget && e.relatedTarget.contains(titleRef.current);
    // if focus is moving to somewhere within the same note, then focus
    if (focusWithinSameNote) focusNoteById(id);
  }

  render() {
    const { id, title, className, focusable, selected, editing, titleRef } =
      this.props;

    return (
      <div
        tabIndex={focusable || selected ? 0 : -1}
        data-note-id={id}
        className={className}
        onFocus={this.focusNote}
        onClick={this.maybeMarkAsSelected}
        onKeyDown={this.maybeDoAction}
        aria-selected={selected}>
        <span className="note__content">
          <span
            className={editing ? "outline-none" : "hidden"}
            ref={titleRef}
            contentEditable={editing}
            suppressContentEditableWarning={true}
            tabIndex={editing ? 0 : -1}
            onKeyDown={this.maybeStopEditing}
            onBlur={this.stopEditing}>
            {title}
          </span>
          <span
            className={editing ? "hidden" : "select-none hover:cursor-text"}
            onClick={this.startEditing}>
            {title}
          </span>
        </span>
      </div>
    );
  }
}

export function Note({
  id,
  title,
  type,
  focusable,
  selected,
  markAsSelected,
  updateTitle,
  add,
  remove,
  navigate,
}) {
  const { editing, setEditing, titleRef } = useNote(false);

  function getClassName(type: string, selected: boolean) {
    let classNames = ["note"];

    switch (type) {
      case NOTE_TYPE.EPIC:
        classNames.push("note--epic");
        break;
      case NOTE_TYPE.FEATURE:
        classNames.push("note--feature");
        break;
      case NOTE_TYPE.STORY:
        classNames.push("note--story");
        break;
      default:
        break;
    }

    if (selected) classNames.push("note--selected");

    return classNames.join(" ");
  }

  const className = useMemo(
    () => getClassName(type, selected),
    [type, selected]
  );

  return (
    <NoteComponent
      id={id}
      title={title}
      type={type}
      focusable={focusable}
      selected={selected}
      markAsSelected={markAsSelected}
      updateTitle={updateTitle}
      add={add}
      remove={remove}
      navigate={navigate}
      editing={editing}
      setEditing={setEditing}
      titleRef={titleRef}
      className={className}
    />
  );
}
