import { ActionButton } from "../../ActionButton";

export function Remove({ button, isSelected, navigate, removeNote }) {

  return (
    <ActionButton
      id={button.id}
      icon={button.iconCls}
      label={button.label}
      title={button.title}
      selected={isSelected}
      disabled={button.disabled}
      navigate={navigate}
      doAction={removeNote} />
  )
}