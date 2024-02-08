import { NOTE_TYPE } from "../../../const";
import ActionButton from "../ActionButton";

export function Remove({ button, isSelected, navigate, selected, removeNote }) {

  function remove() {
    switch (selected.type) {
      case NOTE_TYPE.EPIC:
        removeNote(selected.id);
        break;
      case NOTE_TYPE.FEATURE:
        removeNote(selected.epicId, selected.id);
        break;
      case NOTE_TYPE.STORY:
        removeNote(selected.epicId, selected.featureId, selected.id);
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
      doAction={remove} />
  )
}