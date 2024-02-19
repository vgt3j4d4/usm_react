import { useContext } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../const";
import { NoteContext } from "../context/NoteContext";
import { StoriesContext } from "../context/StoriesContext";
import * as storiesService from "../services/StoriesService";
import { useStoryMapHistory } from "./useStoryMapHistory";
import { useStoryMapOps } from "./useStoryMapOps";

const HISTORY_ACTIONS = Object.freeze({
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

// eslint-disable-next-line
const REDO_ACTION_MAP = Object.freeze(new Map([
  [HISTORY_ACTIONS.ADD_EPIC, HISTORY_ACTIONS.REMOVE_EPIC],
  [HISTORY_ACTIONS.ADD_FEATURE, HISTORY_ACTIONS.REMOVE_FEATURE],
  [HISTORY_ACTIONS.ADD_STORY, HISTORY_ACTIONS.REMOVE_STORY],
  [HISTORY_ACTIONS.REMOVE_EPIC, HISTORY_ACTIONS.ADD_EPIC],
  [HISTORY_ACTIONS.REMOVE_FEATURE, HISTORY_ACTIONS.ADD_FEATURE],
  [HISTORY_ACTIONS.REMOVE_STORY, HISTORY_ACTIONS.ADD_STORY],
  [HISTORY_ACTIONS.UPDATE_EPIC_TITLE, HISTORY_ACTIONS.UPDATE_EPIC_TITLE],
  [HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, HISTORY_ACTIONS.UPDATE_FEATURE_TITLE],
  [HISTORY_ACTIONS.UPDATE_STORY_TITLE, HISTORY_ACTIONS.UPDATE_STORY_TITLE],
]));

export function useStoryMap() {
  const {
    epicListRef, featureListRef,
    epics, features,
    setEpics, setFeatures,
    storyMapHistoryRef
  } = useContext(StoriesContext);
  const {
    selected, setSelected,
    isFocused, setIsFocused,
    focus
  } = useContext(NoteContext);
  const {
    addToHistory,
    canUndo, canRedo,
    getUndoItem, getRedoItem,
    undo, redo
  } = useStoryMapHistory({ storyMapHistoryRef });
  const storyMapOps = useStoryMapOps({ epicListRef, featureListRef });

  const storyMapId = storyMapHistoryRef.current;

  async function addNewEpic(originEpicId) {
    const epic = await storiesService.addEpic(storyMapId);
    if (!epic) return;

    const { newEpics, newFeatures } = storyMapOps.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);
    addToHistory({ id: HISTORY_ACTIONS.ADD_EPIC, params: { epic, originEpicId } });
  }

  async function addNewFeature(epicId, originFeatureId) {
    const feature = await storiesService.addFeature(storyMapId, epicId);

    if (feature) {
      const { newFeatures } = storyMapOps.addFeature(feature, originFeatureId);
      // TODO: should I call setEpics too?
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_FEATURE, params: { feature, originFeatureId } });
    }
  }

  async function addNewStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addStory(storyMapId, epicId, featureId);

    if (story) {
      const { newFeatures } = storyMapOps.addStory(story, originStoryId);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_STORY, params: { story, originStoryId } });
    }
  }

  async function removeEpicById(epicId) {
    try {
      await storiesService.removeEpic(epicId);
      return true;
    } catch (e) { }
    return false;
  }

  async function removeFeatureById(epicId, featureId) {
    try {
      await storiesService.removeFeature(epicId, featureId);
      return true;
    } catch (e) { }
    return false;
  }

  async function removeStoryById(epicId, featureId, storyId) {
    try {
      await storiesService.removeStory(epicId, featureId, storyId);
      return true;
    } catch (e) { }
    return false;
  }

  async function updateEpic(epic) {
    try {
      await storiesService.updateEpic(epic);
      return true;
    } catch (e) { }
    return false;
  }

  async function updateFeature(feature) {
    try {
      await storiesService.updateFeature(feature);
      return true;
    } catch (e) { }
    return false;
  }

  async function updateStory(story) {
    try {
      await storiesService.updateStory(story);
      return true;
    } catch (e) { }
    return false;
  }

  function updateEpicTitle(epicId, title) {
    const epic = epics.find(e => e.id === epicId);
    if (!updateEpic({ ...epic, title })) return;

    const { newEpics } = storyMapOps.updateEpic(epicId, { title });
    setEpics(newEpics);
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: { id: epic.id, title: epic.title } });
  }

  function updateFeatureTitle(featureId, title) {
    const feature = features.find(f => f.id === featureId);
    if (!updateFeature({ ...feature, title })) return;

    const { newFeatures } = storyMapOps.updateFeature(featureId, { title });
    setFeatures(newFeatures);
    addToHistory({ id: HISTORY_ACTIONS.removeStory, params: { id: feature.id, title: feature.title } });
  }

  function updateStoryTitle(epicId, featureId, storyId, title) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;
    if (!updateStory({ ...story, title })) return;

    const { newFeatures } = storyMapOps.updateStory(featureId, storyId, { title });
    setFeatures(newFeatures);
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: { id: storyId.id, featureId, title } });
  }

  async function maybeRemoveEpic(epicId) {
    if (epics.length === 1) return;

    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const success = await removeEpicById(epicId);
    if (success) {
      const { newEpics, newFeatures } = storyMapOps.removeEpic(epic);
      setEpics(newEpics);
      setFeatures(newFeatures);
      const oldIndex = epics.indexOf(epic);
      const epicToFocus = newEpics[oldIndex] || newEpics[oldIndex - 1];
      setSelected({ id: epicToFocus.id, type: NOTE_TYPE.EPIC, focus: true });
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: { epic, index: epics.indexOf(epic) } });
    }
  }

  async function maybeRemoveFeature(epicId, featureId) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    const success = await removeFeatureById(epicId, featureId);
    if (success) {
      const { newEpics, newFeatures } = storyMapOps.removeFeature(feature);
      setEpics(newEpics);
      setFeatures(newFeatures);
      const oldIndex = features.indexOf(feature);
      let featureToFocus = newFeatures[oldIndex] || newFeatures[oldIndex - 1];
      setSelected({ id: featureToFocus.id, epicId, type: NOTE_TYPE.FEATURE, focus: true });
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: { feature, index: features.indexOf(feature) } });
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.stories.length === 1) return;

    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;
    const oldIndex = feature.stories.indexOf(story);

    const success = await removeStoryById(epicId, featureId, storyId);
    if (success) {
      const { newFeatures } = storyMapOps.removeStory(story);
      setFeatures(newFeatures);
      const storyToFocus = feature.stories[oldIndex] || feature.stories[oldIndex - 1];
      setSelected({ id: storyToFocus.id, featureId, epicId, type: NOTE_TYPE.STORY, focus: true });
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_STORY, params: { story, index: feature.stories.indexOf(story) } });
    }
  }

  function maybeNavigate(arrowKey) {
    let epic, feature, story;
    let index, toFocus;

    switch (selected.type) {
      case NOTE_TYPE.EPIC:
        epic = epics.find(e => e.id === selected.id);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.DOWN:
            feature = epic.features[0];
            setSelected({ id: feature.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          case ARROW_KEYS.LEFT:
            index = epics.indexOf(epic);
            if (index === 0) return;

            toFocus = epics[index - 1];
            setSelected({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          case ARROW_KEYS.RIGHT:
            index = epics.indexOf(epic);
            if (index === (epics.length - 1)) return;

            toFocus = epics[index + 1];
            setSelected({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          default:
            // no-op
            break;
        }
        break;
      case NOTE_TYPE.FEATURE:
        feature = features.find(f => f.id === selected.id);
        if (!feature) return;

        epic = epics.find(e => e.id === selected.epicId);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.UP:
            toFocus = epic;
            setSelected({ id: toFocus.id, type: NOTE_TYPE.EPIC, focus: true });
            break;
          case ARROW_KEYS.DOWN:
            toFocus = feature.stories[0];
            setSelected({
              id: toFocus.id, featureId: feature.id, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === 0) return;

            toFocus = features[index - 1];
            setSelected({ id: toFocus.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          case ARROW_KEYS.RIGHT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === (features.length - 1)) return;

            toFocus = features[index + 1];
            setSelected({ id: toFocus.id, epicId: epic.id, type: NOTE_TYPE.FEATURE, focus: true });
            break;
          default:
            // no-op
            break;
        }
        break;
      case NOTE_TYPE.STORY:
        feature = features.find(f => f.id === selected.featureId);
        if (!feature) return;

        story = feature.stories.find(s => s.id === selected.id);
        if (!story) return;

        index = feature.stories.indexOf(story);
        switch (arrowKey) {
          case ARROW_KEYS.UP:
            if (index === 0) {
              toFocus = feature;
              setSelected({ id: toFocus.id, epicId: toFocus.epicId, type: NOTE_TYPE.FEATURE, focus: true });
            } else {
              toFocus = feature.stories[index - 1];
              setSelected({ id: toFocus.id, featureId: feature.id, epicId: feature.epicId, type: NOTE_TYPE.STORY, focus: true });
            }
            break;
          case ARROW_KEYS.DOWN:
            if (index === (feature.stories.length - 1)) return;
            toFocus = feature.stories[index + 1];
            setSelected({
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

            setSelected({
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

            setSelected({
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

  // eslint-disable-next-line
  function getActionById(actionId) {
    switch (actionId) {
      case HISTORY_ACTIONS.ADD_EPIC:
        return storyMapOps.addEpic;
      case HISTORY_ACTIONS.ADD_FEATURE:
        return storyMapOps.addFeature;
      case HISTORY_ACTIONS.ADD_STORY:
        return storyMapOps.addStory;
      case HISTORY_ACTIONS.REMOVE_EPIC:
        return storyMapOps.removeEpic;
      case HISTORY_ACTIONS.REMOVE_FEATURE:
        return storyMapOps.updateFeature;
      case HISTORY_ACTIONS.REMOVE_STORY:
        return storyMapOps.removeStory;
      case HISTORY_ACTIONS.UPDATE_EPIC_TITLE:
        return updateEpicTitle;
      case HISTORY_ACTIONS.UPDATE_FEATURE_TITLE:
        return updateFeatureTitle;
      case HISTORY_ACTIONS.UPDATE_STORY_TITLE:
        return updateStoryTitle;
      default: return null;
    }
  }

  function doUndo() {
    const item = getUndoItem();

    // TODO: actually undo the item.action

    undo(item);
  }

  function doRedo() {
    const item = getRedoItem();

    // TODO: actually redo the item.action

    redo(item);
  }

  return {
    epics, features,
    addNewEpic, addNewFeature, addNewStory,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    selected, setSelected, focus,
    isFocused, setIsFocused,
    canUndo, canRedo,
    doUndo, doRedo,
  }
};