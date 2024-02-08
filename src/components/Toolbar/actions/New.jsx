import { NOTE_TYPE } from "../../../const";
import ActionButton from "../ActionButton";

export function New({ button, isSelected, navigate, selected, addNote }) {

  function add() {
    switch (selected.type) {
      case NOTE_TYPE.EPIC:
        addNote(selected.id);
        break;
      case NOTE_TYPE.FEATURE:
        addNote(selected.epicId, selected.id);
        break;
      case NOTE_TYPE.STORY:
        addNote(selected.epicId, selected.featureId, selected.id);
        break;
      default:
        break;
    }
  }

  return (
    <ActionButton
      id={button.id}
      icon={button.iconCls}
      label={button.label}
      title={button.title}
      selected={isSelected}
      disabled={button.disabled}
      navigate={navigate}
      doAction={add} />
  )
}