import { addItemAtIndex } from "../utils/utils";

const MAX_HISTORY_LENGTH = 10;

export const HISTORY_ACTIONS = Object.freeze({
  ADD_EPIC: 'addEpic',
  ADD_FEATURE: 'addFeature',
  ADD_STORY: 'addStory',
  REMOVE_EPIC: 'removeEpic',
  REMOVE_FEATURE: 'removeFeature',
  REMOVE_STORY: 'removeStory'
});

export function useStoriesHistory({ storiesHistory, epics, features }) {

  function addToHistory(action) {
    const { index, actions } = storiesHistory.current;
    let newIndex = index || 0;
    let newActions = [...actions];

    if (actions.length < MAX_HISTORY_LENGTH) {
      newIndex += 1;
      newActions = addItemAtIndex(newActions, action, newIndex);
    } else {
      // newIndex stays the same just update the newActions
      newActions.push(action);
      newActions = newActions.slice(1);
    }

    storiesHistory.current = { index: newIndex, actions: newActions };
  }

  function getCurrentFromHistory() {
    const { index, actions } = storiesHistory.current;
    if (actions.length === 0) return undefined;
    if (isNaN(index) || index < 0 || index > (actions.length - 1)) return undefined;
    return actions[index];
  }

  function canUndo() {
    const { index, actions } = storiesHistory.current;
    return actions.length > 0 && index > 0;
  }

  function canRedo() {
    const { index, actions } = storiesHistory.current;
    return actions.length > 0 && index < (actions.length - 1);
  }

  function undo() { }

  function redo() { }

  return {
    addToHistory,
    canUndo, canRedo
  }
}