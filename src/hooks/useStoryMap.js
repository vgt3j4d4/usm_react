import { ARROW_KEYS, NOTE_TYPE } from "../const";
import * as storiesService from "../services/StoriesService";
import * as utils from "../utils/utils";
import { useStoryMapHistory } from "./useStoryMapHistory";

export const HISTORY_ACTIONS = Object.freeze({
  ADD_EPIC: 'addEpic',
  ADD_FEATURE: 'addFeature',
  ADD_STORY: 'addStory',
  REMOVE_EPIC: 'removeEpic',
  REMOVE_FEATURE: 'removeFeature',
  REMOVE_STORY: 'removeStory',
  UPDATE_TITLE: 'updateTitle'
});

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

  async function addEpic(originEpicId) {
    const epic = await storiesService.addEpic(storyMapIdRef.current);
    if (!epic) return;

    let newEpics, newFeatures;
    const originEpic = epics.find(e => e.id === originEpicId);
    if (originEpic && epics.length > 1) { // add the new epic at next to originEpic
      const originEpicIndex = epics.indexOf(originEpic);
      newEpics = utils.addItemAtIndex([...epics], epic, originEpicIndex + 1);
      const epicFeatures = features.filter(f => f.epicId === originEpic.id);
      const lastFeatureIndex = features.indexOf(epicFeatures[epicFeatures.length - 1]);
      newFeatures = utils.addItemAtIndex([...features], epic.features[0], lastFeatureIndex + 1);
    } else { // add epic at the end of the epics array
      newEpics = [...epics, epic];
      features.push(epic.features[0]);
    }

    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);
    addToHistory({ id: HISTORY_ACTIONS.ADD_EPIC, params: { epic, originEpicId } });
  }

  async function addFeature(epicId, originFeatureId) {
    const feature = await storiesService.addFeature(storyMapIdRef.current, epicId);

    if (feature) {
      let newFeatures;
      const originFeature = originFeatureId ? features.find(f => f.id === originFeatureId) : null;
      if (originFeature && features.length > 1) {
        const index = features.indexOf(originFeature);
        newFeatures = utils.addItemAtIndex([...features], feature, index + 1);
      } else {
        newFeatures = [...features, feature];
      }

      const epic = epics.find(e => e.id === epicId);
      epic.features.push(feature);
      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_FEATURE, params: { feature, originFeatureId } });
    }
  }

  async function addStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addStory(storyMapIdRef.current, epicId, featureId);

    if (story) {
      let newFeatures;
      const feature = features.find(f => f.id === featureId);
      if (originStoryId && feature.stories.length > 1) {
        const originStory = feature.stories.find(s => s.id === originStoryId);
        const index = feature.stories.indexOf(originStory);
        newFeatures = features.map(f =>
          f.id === featureId ? { ...f, stories: utils.addItemAtIndex([...f.stories], story, index + 1) } : f
        );
      } else {
        newFeatures = features.map(f =>
          f.id === featureId ? { ...f, stories: [...f.stories, story] } : f
        );
      }

      setFeatures(newFeatures);
      addToHistory({ id: HISTORY_ACTIONS.ADD_STORY, params: { story, originStoryId } });
    }
  }

  async function _removeEpic(epicId) {
    const epic = epics.find(e => e.id === epicId);
    if (epic) {
      await storiesService.removeEpic(epicId);
      setEpics(epics.filter(e => e.id !== epic.id));
      setFeatures(features.filter(f => f.epicId !== epic.id));
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: { epic, index: epics.indexOf(epic) } });
      return true;
    }
    return false;
  }

  async function _removeFeature(epicId, featureId) {
    const feature = features.find(f => f.epicId === epicId);
    if (feature) {
      await storiesService.removeFeature(epicId, featureId);
      setEpics(epics.map(e => e.id === epicId ? { ...e, features: e.features.filter(f => f.id !== featureId) } : e));
      setFeatures(features.filter(f => f.id !== featureId));
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: { feature, index: features.indexOf(feature) } });
      return true;
    }
    return false;
  }

  async function _removeStory(epicId, featureId, storyId) {
    const feature = features.find(f => f.id === featureId);
    const story = feature.stories.find(s => s.id === storyId);
    if (story) {
      await storiesService.removeStory(epicId, featureId, storyId);
      setFeatures(features.map(f => f.id === featureId ? { ...f, stories: f.stories.filter(s => s.id !== storyId) } : f));
      addToHistory({ id: HISTORY_ACTIONS.REMOVE_STORY, params: { story, index: feature.stories.indexOf(story) } });
      return true;
    }

    return false;
  }

  function updateEpicTitle(epicId, title) {
    const epic = epics.find(e => e.id === epicId);
    setEpics(epics.map(e => e === epic ? { ...e, title } : e));
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_TITLE, params: { id: epic.id, title: epic.title } });
  }

  function updateFeatureTitle(featureId, title) {
    const feature = features.find(f => f.id === featureId);
    setFeatures(features.map(f => f === feature ? { ...f, title } : f));
    addToHistory({ id: HISTORY_ACTIONS.UPDATE_TITLE, params: { id: feature.id, title: feature.title } });
  }

  function updateStoryTitle(featureId, storyId, title) {
    setFeatures(features.map(f => {
      if (f.id === featureId) {
        const story = f.stories.find(s => s.id === storyId);
        if (story) return { ...f, stories: f.stories.map(s => s.id === storyId ? { ...s, title } : s) }
      }
      return f;
    }))
  }

  async function maybeRemoveEpic(epicId) {
    if (epics.length === 1) return;

    const success = await _removeEpic(epicId);
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

    const success = await _removeFeature(epicId, featureId);
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

    const success = await _removeStory(epicId, featureId, storyId);
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
    addEpic, addFeature, addStory,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    selected, setSelected, focus,
    isFocused, setIsFocused,
    canUndo, canRedo,
    doUndo, doRedo,
  }
};