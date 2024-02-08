import { useContext, useEffect, useState } from "react";
import { NOTE_TYPE } from "../../const";
import { MapSelectionContext } from "../../context/MapSelectionContext";
import { StoriesContext } from "../../context/StoriesContext";
import { useStoryMap } from "../../hooks/useStoryMap";
import ActionButton from "./ActionButton";
import { BUTTON_NAVIGATION } from "./Toolbar";

const TOOLBAR_BUTTONS = [
  { id: 1, label: 'Select', title: 'Select', iconCls: 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 2, label: 'New', title: 'New (+)', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 3, label: 'Remove', title: 'Remove (Del)', iconCls: 'fa-trash-can', disabled: false, action: 'remove' }
];

export function MapButtons() {
  const {
    epics, features,
    addEpic, addFeature, addStory,
    selected, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory
  } = useStoryMap({
    ...useContext(StoriesContext), ...useContext(MapSelectionContext)
  });
  const [activeIndex, setActiveIndex] = useState(0);

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
        focus();
        break;
      case 'addNew':
        switch (selected.type) {
          case NOTE_TYPE.EPIC:
            addEpic(selected.id);
            break;
          case NOTE_TYPE.FEATURE:
            addFeature(selected.epicId, selected.id);
            break;
          case NOTE_TYPE.STORY:
            addStory(selected.epicId, selected.featureId, selected.id);
            break;
          default:
            break;
        }
        break;
      case 'remove':
        switch (selected.type) {
          case NOTE_TYPE.EPIC:
            maybeRemoveEpic(selected.id);
            break;
          case NOTE_TYPE.FEATURE:
            maybeRemoveFeature(selected.epicId, selected.id);
            break;
          case NOTE_TYPE.STORY:
            maybeRemoveStory(selected.epicId, selected.featureId, selected.id);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  function getToolbarButtons() {
    let epic, feature;
    let selectedEpic, selectedFeature, selectedStory;

    selectedEpic = epics.find(e => e.id === selected.id);
    selectedFeature = features.find(f => f.id === selected.id);
    if (selectedFeature) epic = epics.find(e => e.id === selectedFeature.epicId);
    if (selected.type === NOTE_TYPE.STORY) {
      feature = features.find(f => f.id === selected.featureId);
      if (feature) selectedStory = feature.stories.find(s => s.id === selected.id);
    }
    const noSelection = selected.id === undefined;

    return TOOLBAR_BUTTONS.map(b => {
      switch (b.id) {
        case 1: // Select
          return { ...b, disabled: noSelection };
        case 2: // New
          return { ...b, disabled: noSelection }
        case 3: // Remove
          let disabled = selected.id === undefined;
          disabled = disabled || (selectedEpic && epics.length === 1);
          disabled = disabled || (selectedFeature && epic.features.length === 1);
          disabled = disabled || (selectedStory && feature.stories.length === 1);
          return { ...b, disabled };
        default:
          return b;
      }

    });
  }

  const buttons = getToolbarButtons(); // TODO: useMemo?

  return (
    buttons.map((b, index) => (
      <ActionButton key={b.id}
        id={index}
        icon={b.iconCls}
        label={b.label}
        title={b.title}
        selected={activeIndex === index}
        disabled={b.disabled}
        navigateToButton={navigateToButton}
        doAction={() => { doButtonAction(b.action) }} />
    ))
  )
}