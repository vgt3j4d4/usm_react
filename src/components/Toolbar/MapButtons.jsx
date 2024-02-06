import { useContext, useEffect, useMemo, useState } from "react";
import { NOTE_TYPE } from "../../const";
import { MapSelectionContext } from "../../context/MapSelectionContext";
import { StoriesContext } from "../../context/StoriesContext";
import { BUTTON_NAVIGATION } from "./Toolbar";
import ActionButton from "./ActionButton";

const TOOLBAR_BUTTONS = [
  { id: 1, label: 'Select', iconCls: 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 2, label: 'New', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 3, label: 'Remove', iconCls: 'fa-trash-can', disabled: false, action: 'remove' }
];

export function MapButtons() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    selectedNote,
    focusSelectedNote
  } = useContext(MapSelectionContext);
  const {
    epics, features,
    addEpic, addFeature, addStory
  } = useContext(StoriesContext);

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
        focusSelectedNote();
        break;
      case 'addNew':
        switch (selectedNote.type) {
          case NOTE_TYPE.EPIC:
            addEpic();
            break;
          case NOTE_TYPE.FEATURE:
            addFeature(selectedNote.epicId);
            break;
          case NOTE_TYPE.STORY:
            addStory(selectedNote.epicId, selectedNote.featureId);
          default:
            break;
        }
      case 'remove':
        break;
      default:
        break;
    }
  }

  function getToolbarButtons() {
    let epic, feature;
    let selectedEpic, selectedFeature, selectedStory;

    selectedEpic = epics.find(e => e.id === selectedNote.id);
    selectedFeature = features.find(f => f.id === selectedNote.id);
    if (selectedFeature) epic = epics.find(e => e.id === selectedFeature.epicId);
    if (selectedNote.type === NOTE_TYPE.STORY) {
      feature = features.find(f => f.id === selectedNote.featureId);
      if (feature) selectedStory = feature.stories.find(s => s.id === selectedNote.id);
    }
    const noSelectedNote = selectedNote.id === undefined;

    return TOOLBAR_BUTTONS.map(b => {
      switch (b.id) {
        case 1: // Select
          return { ...b, disabled: noSelectedNote };
        case 2: // New
          return { ...b, disabled: noSelectedNote }
        case 3: // Remove
          let disabled = selectedNote.id === undefined;
          disabled = disabled || (selectedEpic && epics.length === 1);
          disabled = disabled || (selectedFeature && epic.features.length === 1);
          disabled = disabled || (selectedStory && feature.stories.length === 1);
          return { ...b, disabled };
        default:
          return b;
      }

    });
  }

  const buttons = useMemo(() => getToolbarButtons(), [selectedNote]);

  return (
    buttons.map((b, index) => (
      <ActionButton key={b.id}
        id={index}
        icon={b.iconCls}
        label={b.label}
        selected={activeIndex === index}
        disabled={b.disabled}
        navigateToButton={navigateToButton}
        doAction={() => { doButtonAction(b.action) }} />
    ))
  )
}