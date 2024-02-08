import * as constants from "../../const";
import { BUTTON_NAVIGATION } from "./Toolbar";

export default function ActionButton({ id, icon, label, title, selected = false, disabled = false, navigate, doAction }) {
  function focusAnotherToolbarButton(e) {
    if (!constants.NAVIGATION_KEYS.includes(e.key)) return;

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

  return (
    <button type="button"
      id={`toolbar__button_${id}`}
      className="flex flex-col items-center p-1 disabled:opacity-50"
      disabled={disabled}
      tabIndex={selected ? '0' : '-1'}
      onKeyDown={(e) => focusAnotherToolbarButton(e)}
      onClick={doAction}
      title={title}>
      <i className={`fa-solid ${icon}`}></i>
      <span className="text-sm max-md:hidden">{label}</span>
    </button>
  )
}