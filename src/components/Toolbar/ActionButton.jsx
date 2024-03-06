import { ARROW_KEYS } from "../../const";
import { BUTTON_NAVIGATION } from "./Toolbar";

export function ActionButton({ id, button, selected = false, navigate, doAction, children }) {
  function focusOtherButton(e) {
    if (!Object.values(ARROW_KEYS).includes(e.key)) return;
    e.preventDefault();

    if (e.key === 'Home') {
      navigate(BUTTON_NAVIGATION.FIRST);
      return;
    }
    if (e.key === 'End') {
      navigate(BUTTON_NAVIGATION.LAST);
      return;
    }
    if (e.key === 'ArrowRight') {
      navigate(BUTTON_NAVIGATION.NEXT);
    } else {
      navigate(BUTTON_NAVIGATION.PREV);
    }
  }

  if (children) return (
    <button type="button"
      id={`toolbar__button_${id}`}
      className="flex flex-col items-center p-1 disabled:opacity-50"
      disabled={button.disabled}
      tabIndex={selected ? '0' : '-1'}
      onKeyDown={(e) => focusOtherButton(e)}
      onClick={doAction}
      title={button.title}>
      {children}
    </button>
  );

  return (
    <button type="button"
      id={`toolbar__button_${id}`}
      className="flex flex-col items-center p-1 disabled:opacity-50"
      disabled={button.disabled}
      tabIndex={selected ? '0' : '-1'}
      onKeyDown={(e) => focusOtherButton(e)}
      onClick={doAction}
      title={button.title}>
      <i className={`fa-solid ${button.iconCls}`}></i>
      <span className="text-sm max-sm:hidden">{button.label}</span>
    </button>
  )
}