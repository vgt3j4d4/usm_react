import { ListItem as Item } from "../../classes/linked-list/ListItem.ts";

const MAX_HISTORY_LENGTH = 25;

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

export const HISTORY_OPERATION = Object.freeze({
  NONE: 'none',
  UNDO: 'undo',
  REDO: 'redo',
});

export function useHistory({ storyMapHistoryRef }) {
  const { undoList, redoList } = storyMapHistoryRef.current;

  function addToUndo(action) {
    undoList.prepend(new Item(action));
    if (undoList.size > MAX_HISTORY_LENGTH) undoList.tail.detach();
  }

  function addToRedo(action) {
    redoList.prepend(new Item(action));
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

  function getItemValue(list) {
    const item = list.head;
    if (!item) {
      console.error('List is empty');
      return null;
    }
    return item.value;
  }

  function getUndo() {
    return getItemValue(undoList);
  }

  function getRedo() {
    return getItemValue(redoList);
  }

  function undo() {
    const item = getUndoItem();
    if (!item) {
      console.error('Undo list is empty');
      return;
    }
    item.detach();
  }

  function redo() {
    const item = getRedoItem();
    if (!item) {
      console.error('Redo list is empty');
      return;
    }
    item.detach();
  }

  return {
    addToUndo, addToRedo,
    canUndo, canRedo,
    getUndo, getRedo,
    undo, redo,
  }
}