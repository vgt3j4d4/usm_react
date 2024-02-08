import { ActionButton } from "../../ActionButton";

export function New({ button, isSelected, navigate, addNote }) {
  return (
    <ActionButton
      id={button.id}
      icon={button.iconCls}
      label={button.label}
      title={button.title}
      selected={isSelected}
      disabled={button.disabled}
      navigate={navigate}
      doAction={addNote} />
  )
}