import { Item } from "linked-list";

export function getFeatures(epics = [], features = []) {
  if (epics.length > 0) {
    features = [...features, ...epics[0].features];
    return getFeatures(epics.slice(1), features);
  }
  return features;
}

export function buildItem(data) {
  const result = new Item();
  result['data'] = data;
  return result;
}

export function getDataArray(list) {
  return list.toArray().map(i => i.data);
}

export const focusNoteById = (noteId) => {
  const el = document.querySelector(`[data-note-id="${noteId}"]`);
  if (el) el.focus({ focusVisible: true });
}