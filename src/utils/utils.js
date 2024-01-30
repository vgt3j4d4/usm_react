import { DEFAULT_EPIC, DEFAULT_FEATURE, DEFAULT_STORY, NOTE_TYPE } from "../const";

export function buildEpic() {
  return { ...DEFAULT_EPIC, features: [buildFeature()] }
}

export function buildFeature() {
  return { ...DEFAULT_FEATURE, stories: [buildStory()] }
}

export function buildStory() {
  return { ...DEFAULT_STORY };
}

export function getAllFeatures(epics) {

}

export function getAllStories(epics) {

}

export function getNoteId(id, type) {
  let noteId = '';
  switch (type) {
    case NOTE_TYPE.EPIC:
      noteId = `epic-note-${id}`;
      break;
    case NOTE_TYPE.FEATURE:
      noteId = `feature-note-${id}`;
      break;
    case NOTE_TYPE.STORY:
      noteId = `story-note-${id}`;
      break;
    default:
      break;
  }
  return noteId;
}