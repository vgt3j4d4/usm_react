import { Item } from "linked-list";

const MAX_HISTORY_LENGTH = 10;

export function useStoryMapHistory({ storyMapHistoryRef }) {

  function addToHistory(action) {
    const { undo } = storyMapHistoryRef.current;
    const item = new Item();
    item.value = action;

    undo.prepend(item);
    if (undo.size > MAX_HISTORY_LENGTH) undo.tail.detach();
  }

  function canUndo() {
    const { undo } = storyMapHistoryRef.current;
    return undo.size > 0;
  }

  function canRedo() {
    const { redo } = storyMapHistoryRef.current;
    return redo.size > 0;
  }

  function getUndoItem() {
    const { undo } = storyMapHistoryRef.current;
    return undo.head;
  }

  function getRedoItem() {
    const { redo } = storyMapHistoryRef.current;
    return redo.head;
  }

  function undo(item) {
    if (!canUndo()) return;
    const { redo } = storyMapHistoryRef.current;
    item.detach();
    redo.prepend(item);
  }

  function redo(item) {
    if (!canRedo()) return;
    const { undo } = storyMapHistoryRef.current;
    item.detach();
    undo.prepend(item);
  }

  return {
    addToHistory,
    canUndo, canRedo,
    getUndoItem, getRedoItem,
    undo, redo,
  }
}