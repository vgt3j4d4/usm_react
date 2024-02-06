import * as constants from "../../const";
import { BUTTON_NAVIGATION } from "./Toolbar";

export default function ActionButton({ id, icon, label, selected = false, disabled = false, navigateToButton, doAction }) {
  function focusAnotherToolbarButton(e) {
    if (!constants.NAVIGATION_KEYS.includes(e.key)) return;

    if (e.key === 'Home') {
      navigateToButton(BUTTON_NAVIGATION.FIRST);
      return;
    }
    if (e.key === 'End') {
      navigateToButton(BUTTON_NAVIGATION.LAST);
      return;
    }
    if (e.key === 'ArrowRight') {
      navigateToButton(BUTTON_NAVIGATION.NEXT);
    } else {
      navigateToButton(BUTTON_NAVIGATION.PREV);
    }
  }

  return (
    <button type="button"
      id={`toolbar__button_${id}`}
      className="flex flex-col items-center p-1 disabled:opacity-50"
      disabled={disabled}
      tabIndex={selected ? '0' : '-1'}
      onKeyDown={(e) => focusAnotherToolbarButton(e)}
      onClick={doAction}>
      <i className={`fa-solid ${icon}`}></i>
      <span className="text-sm max-md:hidden">{label}</span>
    </button>
  )
}