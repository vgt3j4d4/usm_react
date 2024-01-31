import { useContext, useEffect, useState } from "react";
import ToolbarButton from "./ToolbarButton";
import { BUTTON_NAVIGATION } from "./Toolbar";
import { SelectionContext } from "../../context/SelectionContext";
import { NOTE_TYPE } from "../../const";
import { StoriesContext } from "../../context/StoriesContext";

const TOOLBAR_BUTTONS = [
  { id: 1, label: 'Select', iconCls: 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 2, label: 'New', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 3, label: 'Remove', iconCls: 'fa-trash-can', disabled: false, action: 'remove' }
];

export function ToolbarMapButtons() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    selectedMapNote: selectedNote,
    focusMappingNote: focusNote
  } = useContext(SelectionContext);
  const { addEpic } = useContext(StoriesContext);

  useEffect(() => {
    const button = document.getElementById(`toolbar__button_${activeIndex}`);
    if (button) button.focus();
  }, [activeIndex]);

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

  function doButtonAction(action) {
    switch (action) {
      case 'focusSelected':
        focusNote();
        break;
      case 'addNew':
        switch (selectedNote.type) {
          case NOTE_TYPE.EPIC:
            addEpic();
            break;
          case NOTE_TYPE.FEATURE:
          case NOTE_TYPE.STORY:
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  return (
    TOOLBAR_BUTTONS.map((b, index) => (
      <ToolbarButton key={b.id}
        id={index}
        icon={b.iconCls}
        label={b.label}
        selected={activeIndex === index}
        navigateToButton={navigateToButton}
        doAction={() => { doButtonAction(b.action) }} />
    ))
  )
}