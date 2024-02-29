import { useEffect, useState } from "react";
import { NOTE_TYPE } from "../../../const";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap";
import * as keyboardUtils from "../../../utils/keyboardUtils";
import { isMobileOrTablet } from "../../../utils/utils";
import { ActionButton } from "../ActionButton";
import { BUTTON_NAVIGATION } from "../Toolbar";

const TOOLBAR_BUTTONS = [
  { id: 'UNDO', label: 'Undo', title: 'Undo', iconCls: 'fa-rotate-left', disabled: false, action: 'undo' },
  { id: 'REDO', label: 'Redo', title: 'Redo', iconCls: 'fa-rotate-right', disabled: false, action: 'redo' },
  { id: 'FOCUS', label: 'Focus', title: 'Focus', iconCls: isMobileOrTablet() ? 'fa-hand-pointer' : 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
  { id: 'NEW', label: 'New', title: 'New (+)', iconCls: 'fa-file-circle-plus', disabled: false, action: 'addNew' },
  { id: 'REMOVE', label: 'Remove', title: 'Remove (Delete)', iconCls: 'fa-trash-can', disabled: false, action: 'remove' },
  // { id: 'MOVE', label: 'Move', title: 'Move', iconCls: 'fa-up-down-left-right', disabled: false, action: 'move' },
];

export function MapButtons() {
  const {
    epics, features,
    addNewEpic, addNewFeature, addNewStory,
    canUndo, canRedo,
    undo, redo,
    selected, reselect,
    isFocused, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    focusEpicAfterRemoval, focusFeatureAfterRemoval, focusStoryAfterRemoval
  } = useStoryMap();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(function addUndoRedoListener() {
    const undoRedoListener = (event) => {
      if (!canUndo() && !canRedo()) return;

      const undoButton = buttons.find(b => b.id === 'UNDO');
      const redoButton = buttons.find(b => b.id === 'REDO');
      if (!undoButton || !redoButton) return;

      // TODO: check how to comply with Windows, Mac and Linux undo/redo shortcuts
      if (undoButton && canUndo() && keyboardUtils.isUndo(event)) {
        doUndo();
        return;
      }
      // TODO: check how to comply with Windows, Mac and Linux undo/redo shortcuts
      if (redoButton && canRedo() && keyboardUtils.isRedo(event)) {
        doRedo();
        return;
      }
    };

    document.addEventListener('keydown', undoRedoListener);
    return () => { document.removeEventListener('keydown', undoRedoListener); }
  });

  const [buttons, activeButtons] = getToolbarButtons();
  if (buttons[activeIndex].disabled && activeButtons.length > 0) {
    setActiveIndex(buttons.indexOf(activeButtons[0]));
  }

  function navigate(buttonNav) {
    if (activeButtons.length === 0) return;

    let newIndex = null;
    switch (buttonNav) {
      case BUTTON_NAVIGATION.FIRST: {
        newIndex = buttons.indexOf(activeButtons[0]);
        break;
      }
      case BUTTON_NAVIGATION.LAST: {
        newIndex = buttons.indexOf(activeButtons[activeButtons.length - 1]);
        break;
      }
      case BUTTON_NAVIGATION.NEXT: {
        const button = buttons[activeIndex];
        const index = activeButtons.indexOf(button);
        if (index === (activeButtons.length - 1)) newIndex = buttons.indexOf(activeButtons[0]);
        else newIndex = buttons.indexOf(activeButtons[index + 1]);
        break;
      }
      case BUTTON_NAVIGATION.PREV: {
        const button = buttons[activeIndex];
        const index = activeButtons.indexOf(button);
        if (index === 0) newIndex = buttons.indexOf(activeButtons[activeButtons.length - 1]);
        else newIndex = buttons.indexOf(activeButtons[index - 1]);
        break;
      }
      default:
        return;
    }

    setActiveIndex(() => newIndex);
    const button = document.getElementById(`toolbar__button_${newIndex}`);
    if (button) button.focus();
  }

  function addNote() {
    switch (selected.type) {
      case NOTE_TYPE.EPIC:
        addNewEpic(selected.id);
        reselect();
        break;
      case NOTE_TYPE.FEATURE:
        addNewFeature(selected.epicId, selected.id);
        reselect();
        break;
      case NOTE_TYPE.STORY:
        addNewStory(selected.epicId, selected.featureId, selected.id);
        reselect();
        break;
      default:
        break;
    }
  }

  async function removeNote() {
    switch (selected.type) {
      case NOTE_TYPE.EPIC:
        const removedEpic = await maybeRemoveEpic(selected.id);
        if (removedEpic) focusEpicAfterRemoval(removedEpic);
        break;
      case NOTE_TYPE.FEATURE:
        const removedFeature = await maybeRemoveFeature(selected.epicId, selected.id);
        if (removedFeature) focusFeatureAfterRemoval(removedFeature);
        break;
      case NOTE_TYPE.STORY:
        const removedStory = await maybeRemoveStory(selected.epicId, selected.featureId, selected.id);
        if (removedStory) focusStoryAfterRemoval(removedStory);
        break;
      default:
        break;
    }
  }

  function doUndo() {
    undo();
    focus();
  }

  function doRedo() {
    redo();
    focus();
  }

  function getToolbarButtons() {
    const noSelection = selected.id === undefined;
    const buttons = TOOLBAR_BUTTONS.map(b => {
      switch (b.id) {
        case 'UNDO':
          return { ...b, disabled: !canUndo() };
        case 'REDO':
          return { ...b, disabled: !canRedo() };
        case 'FOCUS':
          return { ...b, disabled: noSelection || isFocused };
        case 'NEW':
          return { ...b, disabled: noSelection }
        case 'REMOVE':
          const isSingleEpic = epics.length === 1;
          const parentEpic = selected.type === NOTE_TYPE.FEATURE && epics.find(e => e.id === selected.epicId);
          const isSingleFeature = features.length === 1 || (parentEpic && parentEpic.features.length === 1);
          const parentFeature = selected.type === NOTE_TYPE.STORY && features.find(f => f.id === selected.featureId);
          const isSingleStory = parentFeature && parentFeature.stories.length === 1;
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

  return (
    buttons.map((b, index) => {
      // TODO: use builder pattern
      const isActive = activeIndex === index;
      switch (b.id) {
        case 'FOCUS':
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={focus} />
        case 'NEW':
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={addNote} />
        case 'REMOVE':
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={removeNote} />
        case 'UNDO':
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={doUndo} />
        case 'REDO':
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={doRedo} />
        default:
          return <ActionButton key={b.id} id={index} button={b} selected={isActive} navigate={navigate} doAction={() => { }} />;
        // return null;
      }
    })
  )
}