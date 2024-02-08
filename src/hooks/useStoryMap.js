import { useState } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../const";

export function useStoryMap({
  epics, features,
  updateEpicTitle, updateFeatureTitle, updateStoryTitle,
  addEpic, addFeature, addStory,
  removeEpic, removeFeature, removeStory,
  selectedNote, setSelectedNote, focus, clear
}) {
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  async function maybeRemoveEpic(epicId) {
    const success = await removeEpic(epicId);
    if (success) {
      clear();
      setIsNoteFocused(false);
    }
  }

  async function maybeRemoveFeature(epicId, featureId) {
    const success = await removeFeature(epicId, featureId);
    if (success) {
      clear();
      setIsNoteFocused(false);
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId) {
    const success = await removeStory(epicId, featureId, storyId);
    if (success) {
      clear();
      setIsNoteFocused(false);
    }
  }

  function maybeNavigate(arrowKey) {
    let epic, feature, story;
    let index, toFocus;

    switch (selectedNote.type) {
      case NOTE_TYPE.EPIC:
        epic = epics.find(e => e.id === selectedNote.id);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.DOWN:
            feature = epic.features[0];
            setSelectedNote({ id: feature.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          case ARROW_KEYS.LEFT:
            index = epics.indexOf(epic);
            if (index === 0) return;

            toFocus = epics[index - 1];
            setSelectedNote({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          case ARROW_KEYS.RIGHT:
            index = epics.indexOf(epic);
            if (index === (epics.length - 1)) return;

            toFocus = epics[index + 1];
            setSelectedNote({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          default:
            // no-op
            break;
        }
        break;
      case NOTE_TYPE.FEATURE:
        feature = features.find(f => f.id === selectedNote.id);
        if (!feature) return;
        epic = epics.find(e => e.id === selectedNote.epicId);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.UP:
            toFocus = epic;
            setSelectedNote({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          case ARROW_KEYS.DOWN:
            toFocus = feature.stories[0];
            setSelectedNote({
              id: toFocus.id, featureId: feature.id, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === 0) return;

            toFocus = features[index - 1];
            setSelectedNote({ id: toFocus.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          case ARROW_KEYS.RIGHT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === (features.length - 1)) return;

            toFocus = features[index + 1];
            setSelectedNote({ id: toFocus.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          default:
            // no-op
            break;
        }
        break;
      case NOTE_TYPE.STORY:
        feature = features.find(f => f.id === selectedNote.featureId);
        if (!feature) return;
        story = feature.stories.find(s => s.id === selectedNote.id);
        if (!story) return;

        index = feature.stories.indexOf(story);
        switch (arrowKey) {
          case ARROW_KEYS.UP:
            toFocus = index === 0 ? feature : feature.stories[index - 1];
            setSelectedNote({ id: toFocus.id, epicId: toFocus.epicId, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          case ARROW_KEYS.DOWN:
            if (index === (feature.stories.length - 1)) return;
            toFocus = feature.stories[index + 1];
            setSelectedNote({
              id: toFocus.id, featureId: toFocus.featureId, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            index = features.indexOf(feature);
            if (index === 0) return;

            const previousFeature = features[index - 1];
            index = feature.stories.indexOf(story);
            if (index <= (previousFeature.stories.length - 1)) toFocus = previousFeature.stories[index];
            else toFocus = previousFeature.stories[previousFeature.stories.length - 1];

            setSelectedNote({
              id: toFocus.id, featureId: feature.id, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true
            });
            break;
          case ARROW_KEYS.RIGHT:
            index = features.indexOf(feature);
            if (index === (features.length - 1)) return;

            const nextFeature = features[index + 1];
            index = feature.stories.indexOf(story);
            if (index <= (nextFeature.stories.length - 1)) toFocus = nextFeature.stories[index];
            else toFocus = nextFeature.stories[nextFeature.stories.length - 1];

            setSelectedNote({
              id: toFocus.id, featureId: feature.id, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true
            });
            break;
          default:
            // no-op
            break;
        }
        break;
      default:
        // no-op
        break;
    }
  }

  return {
    epics, features,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    addEpic, addFeature, addStory,
    removeEpic, removeFeature, removeStory,
    selectedNote, setSelectedNote, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    isNoteFocused, setIsNoteFocused
  }
};