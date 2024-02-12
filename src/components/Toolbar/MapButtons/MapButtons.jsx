import { useContext, useState } from "react";
import { NOTE_TYPE } from "../../../const";
import { NoteContext } from "../../../context/NoteContext";
import { StoriesContext } from "../../../context/StoriesContext";
import { useStoryMap } from "../../../hooks/useStoryMap";
import { isMobileOrTablet } from "../../../utils/utils";
import { ActionButton } from "../ActionButton";
import { BUTTON_NAVIGATION } from "../Toolbar";

const TOOLBAR_BUTTONS = [
  { id: 'FOCUS', label: 'Focus', title: 'Focus', iconCls: isMobileOrTablet() ? 'fa-hand-pointer' : 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 'NEW', label: 'New', title: 'New (+)', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 'REMOVE', label: 'Remove', title: 'Remove (Delete)', iconCls: 'fa-trash-can', disabled: false, action: 'remove' }
];

export function MapButtons() {
  const {
    epics, features,
    addEpic, addFeature, addStory,
    selected, isFocused, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory
  } = useStoryMap({
    ...useContext(StoriesContext), ...useContext(NoteContext)
  });
  const [activeIndex, setActiveIndex] = useState(0);

  function navigate(buttonNav) {
    if (activeButtons.length === 0) return;

    let _activeIndex = null;
    switch (buttonNav) {
      case BUTTON_NAVIGATION.FIRST: {
        _activeIndex = buttons.indexOf(activeButtons[0]);
        break;
      }
      case BUTTON_NAVIGATION.LAST: {
        _activeIndex = buttons.indexOf(activeButtons[activeButtons.length - 1]);
        break;
      }
      case BUTTON_NAVIGATION.NEXT: {
        const button = buttons[activeIndex];
        const index = activeButtons.indexOf(button);
        if (index === (activeButtons.length - 1)) _activeIndex = buttons.indexOf(activeButtons[0]);
        else _activeIndex = buttons.indexOf(activeButtons[index + 1]);
        break;
      }
      case BUTTON_NAVIGATION.PREV: {
        const button = buttons[activeIndex];
        const index = activeButtons.indexOf(button);
        if (index === 0) _activeIndex = buttons.indexOf(activeButtons[activeButtons.length - 1]);
        else _activeIndex = buttons.indexOf(activeButtons[index - 1]);
        break;
      }
      default:
        return;
    }

    setActiveIndex(() => _activeIndex);
    const button = document.getElementById(`toolbar__button_${_activeIndex}`);
    if (button) button.focus();
  }

  function addNote() {
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
  }

  function removeNote() {
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
  }

  function getToolbarButtons() {
    const noSelection = selected.id === undefined;
    const buttons = TOOLBAR_BUTTONS.map(b => {
      switch (b.id) {
        case 'FOCUS':
          return { ...b, disabled: noSelection || isFocused };
        case 'NEW':
          return { ...b, disabled: noSelection }
        case 'REMOVE':
          const isSingleEpic = epics.length === 1;
          const isSingleFeature = features.length === 1;
          const isSingleStory = selected.type === NOTE_TYPE.FEATURE && features.find(f => f.id === selected.id).stories.length === 1;
          let disabled = selected.id === undefined;
          disabled = disabled || (selected.type === NOTE_TYPE.EPIC && isSingleEpic);
          disabled = disabled || (selected.type === NOTE_TYPE.FEATURE && isSingleFeature);
          disabled = disabled || (selected.type === NOTE_TYPE.STORY && isSingleStory);
          return { ...b, disabled };
        default:
          return b;
      }
    });

    return [buttons, buttons.filter(b => !b.disabled)];
  }

  const [buttons, activeButtons] = getToolbarButtons();
  if (buttons[activeIndex].disabled && activeButtons.length > 0) {
    setActiveIndex(buttons.indexOf(activeButtons[0]));
  }

  return (
    buttons.map((b, index) => {
      // TODO: use builder pattern
      switch (b.id) {
        case 'FOCUS':
          return <ActionButton key={b.id} id={index} button={b} selected={activeIndex === index} navigate={navigate} doAction={focus} />
        case 'NEW':
          return <ActionButton key={b.id} id={index} button={b} selected={activeIndex === index} navigate={navigate} doAction={addNote} />
        case 'REMOVE':
          return <ActionButton key={b.id} id={index} button={b} selected={activeIndex === index} navigate={navigate} doAction={removeNote} />
        default:
          return null;
      }
    })
  )
}