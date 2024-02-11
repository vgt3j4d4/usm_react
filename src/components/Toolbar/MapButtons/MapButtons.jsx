import { useContext, useEffect, useState } from "react";
import { NOTE_TYPE } from "../../../const";
import { NoteContext } from "../../../context/NoteContext";
import { StoriesContext } from "../../../context/StoriesContext";
import { useStoryMap } from "../../../hooks/useStoryMap";
import { isMobile } from "../../../utils/utils";
import { ActionButton } from "../ActionButton";
import { BUTTON_NAVIGATION } from "../Toolbar";

const TOOLBAR_BUTTONS = [
  { id: 'FOCUS', label: 'Focus', title: 'Focus', iconCls: isMobile() ? 'fa-hand-pointer' : 'fa-arrow-pointer', disabled: false, action: 'focusSelected' },
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

  useEffect(() => {
    const button = document.getElementById(`toolbar__button_${activeIndex}`);
    if (button) button.focus();
  }, [activeIndex]);

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

    const buttons = TOOLBAR_BUTTONS.map(b => {
      switch (b.id) {
        case 'FOCUS':
          const selectedIsFocused = selected.id === document.activeElement.getAttribute('data-note-id');
          return { ...b, disabled: noSelection || (isFocused && selectedIsFocused) };
        case 'NEW':
          return { ...b, disabled: noSelection }
        case 'REMOVE':
          let disabled = selected.id === undefined;
          disabled = disabled || (selectedEpic && epics.length === 1);
          disabled = disabled || (selectedFeature && epic.features.length === 1);
          disabled = disabled || (selectedStory && feature.stories.length === 1);
          return { ...b, disabled };
        default:
          return b;
      }
    });

    return [buttons, buttons.filter(b => !b.disabled)];
  }

  function navigate(buttonNav) {
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

  // TODO: use activeButtons to set the propert activeIndex when the buttons[activeIndex] is disabled
  // eslint-disable-next-line
  const [buttons, activeButtons] = getToolbarButtons();

  return (
    buttons.map((b, index) => {
      // TODO: use builder pattern
      switch (b.id) {
        case 'FOCUS':
          return <ActionButton key={b.id} id={index} icon={b.iconCls} label={b.label} title={b.title} selected={activeIndex === index} disabled={b.disabled} navigate={navigate} doAction={focus} />
        case 'NEW':
          return <ActionButton key={b.id} id={index} icon={b.iconCls} label={b.label} title={b.title} selected={activeIndex === index} disabled={b.disabled} navigate={navigate} doAction={addNote} />
        case 'REMOVE':
          return <ActionButton key={b.id} id={index} icon={b.iconCls} label={b.label} title={b.title} selected={activeIndex === index} disabled={b.disabled} navigate={navigate} doAction={removeNote} />
        default:
          return null;
      }
    })
  )
}