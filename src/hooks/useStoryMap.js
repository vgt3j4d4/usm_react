import { ARROW_KEYS, NOTE_TYPE } from "../const";
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

export function useStoryMap({
  epics, features,
  setEpics, setFeatures,
  storyMapHistoryRef, storyMapIdRef,
  selected, setSelected, isFocused, setIsFocused, focus
}) {
  const {
    addToHistory,
    canUndo, canRedo,
    getUndoItem, getRedoItem,
    undo, redo
  } = useStoryMapHistory({ storyMapHistoryRef });
  const {
    addToEpics, addToFeatures, addToStories,
    removeFromEpics, removeFromFeatures, removeFromStories,
    updateEpic, updateFeature, updateStory,
  } = useStoryMapOps({ epics, features });

  async function addNewEpic(originEpicId) {
    const epic = await storiesService.addEpic(storyMapIdRef.current);
    if (!epic) return;

    const { newEpics, newFeatures } = addToEpics(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);

    addToHistory({ id: HISTORY_ACTIONS.ADD_EPIC, params: { epic, originEpicId } });
  }

  async function addNewFeature(epicId, originFeatureId) {
    const feature = await storiesService.addFeature(storyMapIdRef.current, epicId);

    if (feature) {
      const { newFeatures } = addToFeatures(feature, originFeatureId);
      // TODO: should I call setEpics too?
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_FEATURE, params: { feature, originFeatureId } });
    }
  }

  async function addNewStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addStory(storyMapIdRef.current, epicId, featureId);

    if (story) {
      const { newFeatures } = addToStories(story, originStoryId);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_STORY, params: { story, originStoryId } });
    }
  }

  async function removeEpicById(epicId) {
    const epic = epics.find(e => e.id === epicId);
    if (epic) {
      await storiesService.removeEpic(epicId);
      const { newEpics, newFeatures } = removeFromEpics(epic);
      setEpics(newEpics);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: { epic, index: epics.indexOf(epic) } });
      return true;
    }
    return false;
  }

  async function removeFeatureById(epicId, featureId) {
    const feature = features.find(f => f.epicId === epicId);
    if (feature) {
      await storiesService.removeFeature(epicId, featureId);
      const { newEpics, newFeatures } = removeFromFeatures(feature);
      setEpics(newEpics);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: { feature, index: features.indexOf(feature) } });
      return true;
    }
    return false;
  }

  async function removeStoryById(epicId, featureId, storyId) {
    const feature = features.find(f => f.id === featureId);
    const story = feature.stories.find(s => s.id === storyId);
    if (story) {
      await storiesService.removeStory(epicId, featureId, storyId);
      const { newFeatures } = removeFromStories(story);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_STORY, params: { story, index: feature.stories.indexOf(story) } });
      return true;
    }

    return false;
  }

  function updateEpicTitle(epicId, title) {
    const epic = epics.find(e => e.id === epicId);
    const { newEpics } = updateEpic(epicId, { title });
    setEpics(newEpics);
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: { id: epic.id, title: epic.title } });
  }

  function updateFeatureTitle(featureId, title) {
    const feature = features.find(f => f.id === featureId);
    const { newFeatures } = updateFeature(featureId, { title });
    setFeatures(newFeatures);
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, params: { id: feature.id, title: feature.title } });
  }

  function updateStoryTitle(featureId, storyId, title) {
    const { newFeatures } = updateStory(featureId, storyId, { title });
    setFeatures(newFeatures);
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: { id: storyId.id, featureId, title } });
  }

  async function maybeRemoveEpic(epicId) {
    if (epics.length === 1) return;

    const success = await removeEpicById(epicId);
    if (success) {
      const index = epics.indexOf(epics.find(e => e.id === epicId));
      let epicToFocus;
      if (index === 0) epicToFocus = epics[index + 1];
      else epicToFocus = epics[index - 1];
      setSelected({ id: epicToFocus.id, type: NOTE_TYPE.EPIC, focus: true });
    }
  }

  async function maybeRemoveFeature(epicId, featureId) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return;

    const success = await removeFeatureById(epicId, featureId);
    if (success) {
      const feature = features.find(f => f.id === featureId);
      const index = features.indexOf(feature);
      const newIndex = index + (index === 0 ? 1 : -1);
      let featureToFocus = features[newIndex];
      if (featureToFocus.epicId !== epicId) featureToFocus = features[newIndex + 2];
      setSelected({ id: featureToFocus.id, epicId, type: NOTE_TYPE.FEATURE, focus: true });
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId) {
    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.stories.length === 1) return;

    const success = await removeStoryById(epicId, featureId, storyId);
    if (success) {
      const feature = features.find(f => f.id === featureId);
      const story = feature.stories.find(s => s.id === storyId);
      const index = feature.stories.indexOf(story);
      const storyToFocus = feature.stories[index + (index === 0 ? +1 : -1)];
      setSelected({ id: storyToFocus.id, featureId, epicId, type: NOTE_TYPE.STORY, focus: true });
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
        return addToEpics;
      case HISTORY_ACTIONS.ADD_FEATURE:
        return addToFeatures;
      case HISTORY_ACTIONS.ADD_STORY:
        return addToStories;
      case HISTORY_ACTIONS.REMOVE_EPIC:
        return removeFromEpics;
      case HISTORY_ACTIONS.REMOVE_FEATURE:
        return removeFromFeatures;
      case HISTORY_ACTIONS.REMOVE_STORY:
        return removeFromStories;
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