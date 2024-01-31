import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ToolbarButton from "./ToolbarButton";
import ToolbarNavButton from "./ToolbarNavButton";
import { SelectedNoteContext } from "../../context/SelectedNoteContext";
import { ROUTES } from "../../routes";

export const BUTTON_NAVIGATION = Object.freeze({
  NEXT: 'next',
  PREV: 'prev',
  FIRST: 'first',
  LAST: 'last'
});

const NAV_BUTTONS = [
  { id: 1, label: 'Map', iconCls: 'fa-map', route: ROUTES.MAPPING },
  { id: 2, label: 'Iterations', iconCls: 'fa-stairs', route: ROUTES.ITERATIONS }
];

const TOOLBAR_BUTTONS = [
  { id: 1, label: 'Select', iconCls: 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 2, label: 'New', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 3, label: 'Remove', iconCls: 'fa-trash-can', disabled: false, action: 'remove' }
];

export function Toolbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const { pathname } = location;
  const {
    selectedMappingNote, setSelectedMappingNote,
    focusMappingNote,
    selectedIterationNote, setSelectedIterationNote,
    focusIterationNote
  } = useContext(SelectedNoteContext);

  useEffect(() => {
    const button = document.getElementById(`toolbar__button_${activeIndex}`);
    if (button) button.focus();
  }, [activeIndex]);

  const isMappingView = pathname === ROUTES.MAPPING;

  function navigateToButton(buttonNav) {
    switch (buttonNav) {
      case BUTTON_NAVIGATION.FIRST: {
        setActiveIndex(0);
        break;
      }
      case BUTTON_NAVIGATION.LAST: {
        setActiveIndex(TOOLBAR_BUTTONS.length - 1);
        break;
      }
      case BUTTON_NAVIGATION.NEXT: {
        if (activeIndex === (TOOLBAR_BUTTONS.length - 1)) setActiveIndex(0);
        else setActiveIndex(() => activeIndex + 1);
        break;
      }
      case BUTTON_NAVIGATION.PREV: {
        if (activeIndex === 0) setActiveIndex(TOOLBAR_BUTTONS.length - 1);
        else setActiveIndex(() => activeIndex - 1);
        break;
      }
      default:
        return;
    }
  }

  function focusNote() {
    if (isMappingView) focusMappingNote()
    else focusIterationNote();
  }

  function doButtonAction(action) {
    switch (action) {
      case 'focusSelected':
        focusNote();
        break;
      default:
        break;
    }
  }

  return (
    <div role="toolbar" className="sticky w-full flex justify-between items-center gap-2 p-2 bg-black text-white">

      <nav role="group">
        <ol className="m-0 p-0">
          {NAV_BUTTONS.map((b, index) => (
            <li className="inline" key={b.id}>
              <ToolbarNavButton
                active={pathname === b.route}
                label={b.label}
                icon={b.iconCls}
                position={index === 0 ? 'first' : index === (NAV_BUTTONS.length - 1) ? 'last' : ''}
                route={b.route} />
            </li>
          ))}
        </ol>
      </nav>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
        {TOOLBAR_BUTTONS.map((b, index) => (
          <ToolbarButton key={b.id}
            id={index}
            icon={b.iconCls}
            label={b.label}
            selected={activeIndex === index}
            navigateToButton={navigateToButton}
            doAction={() => { doButtonAction(b.action) }} />
        ))}
      </div>

      <div>
        <button type="button" className="rounded-full min-w-10 min-h-10">
          <i className="fa-solid fa-user"></i>
        </button>
      </div>

    </div >
  )
}