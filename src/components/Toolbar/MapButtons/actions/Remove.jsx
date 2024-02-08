import { ActionButton } from "../../ActionButton";

export function Remove({ button, isSelected, navigate, remove }) {

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