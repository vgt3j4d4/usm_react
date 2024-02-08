import { ActionButton } from "../../ActionButton";

export function Focus({ button, isSelected, navigate, focus }) {
  return (
    <ActionButton
      id={button.id}
      icon={button.iconCls}
      label={button.label}
      title={button.title}
      selected={isSelected}
      disabled={button.disabled}
      navigate={navigate}
      doAction={focus} />
  )
}