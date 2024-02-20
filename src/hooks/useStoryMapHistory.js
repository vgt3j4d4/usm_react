import { Item } from "linked-list";

const MAX_HISTORY_LENGTH = 10;

export const HISTORY_ACTIONS = Object.freeze({
  ADD_NEW_EPIC: 'addNewEpic',
  ADD_NEW_FEATURE: 'addNewFeature',
  ADD_NEW_STORY: 'addNewStory',
  ADD_EPIC: 'addEpic',
  ADD_FEATURE: 'addFeature',
  ADD_STORY: 'addStory',
  REMOVE_EPIC: 'removeEpic',
  REMOVE_FEATURE: 'removeFeature',
  REMOVE_STORY: 'removeStory',
  UPDATE_EPIC_TITLE: 'updateEpicTitle',
  UPDATE_FEATURE_TITLE: 'updateFeatureTitle',
  UPDATE_STORY_TITLE: 'updateStoryTitle',
});

export function useStoryMapHistory({ storyMapHistoryRef }) {
  const { undoList, redoList } = storyMapHistoryRef.current;

  function addToUndo(action) {
    const item = new Item();
    item.value = action;
    undoList.prepend(item);
    if (undoList.size > MAX_HISTORY_LENGTH) undo.tail.detach();
  }

  function addToRedo(action) {
    const item = new Item();
    item.value = action;
    redoList.prepend(item);
  }

  function canUndo() {
    return undoList.size > 0;
  }

  function canRedo() {
    return redoList.size > 0;
  }

  function getUndoItem() {
    return undoList.head;
  }

  function getRedoItem() {
    return redoList.head;
  }

  function getUndo() {
    const item = getUndoItem();
    const { value } = item;
    return value;
  }

  function getRedo() {
    const item = getRedoItem();
    const { value } = item;
    return value;
  }

  function undo() {
    const item = getUndoItem();
    item.detach();
  }

  function redo() {
    const item = getRedoItem();
    item.detach();
  }

  return {
    addToUndo, addToRedo,
    canUndo, canRedo,
    getUndo, getRedo,
    undo, redo,
  }
}