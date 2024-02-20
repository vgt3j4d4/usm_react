import { useContext } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../const";
import { NoteContext } from "../context/NoteContext";
import { StoriesContext } from "../context/StoriesContext";
import * as storiesService from "../services/StoriesService";
import { HISTORY_ACTIONS, useStoryMapHistory } from "./useStoryMapHistory";
import { useStoryMapLists } from "./useStoryMapLists";

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
  const history = useStoryMapHistory({ storyMapHistoryRef });
  const lists = useStoryMapLists({ epicListRef, featureListRef });

  const storyMapId = storyMapHistoryRef.current;

  async function addNewEpic(originEpicId, addToRedo = false) {
    const epic = await storiesService.addNewEpic(storyMapId);
    if (!epic) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epic.id] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epic.id] });
    }
  }

  async function addEpic(epic, originEpicId, addToRedo = false) {
    const epicId = await storiesService.addEpic(storyMapId, epic, originEpicId);
    if (!epicId) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);

    if (addToRedo) {
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epicId] });
    }
  }

  async function addNewFeature(epicId, originFeatureId) {
    const feature = await storiesService.addNewFeature(storyMapId, epicId);

    if (feature) {
      addFeature(feature, originFeatureId);
      history.addToUndo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: { feature, originFeatureId } });
    }
  }

  function addFeature(feature, originFeatureId) {
    const { newFeatures } = lists.addFeature(feature, originFeatureId);
    setFeatures(newFeatures);
  }

  async function addNewStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addNewStory(storyMapId, epicId, featureId);

    if (story) {
      const { newFeatures } = lists.addStory(story, originStoryId);
      setFeatures(newFeatures);
      history.addToUndo({ id: HISTORY_ACTIONS.ADD_STORY, params: { story, originStoryId } });
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

    const { newEpics } = lists.updateEpic(epicId, { title });
    setEpics(newEpics);
    history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: { id: epic.id, title: epic.title } });
  }

  function updateFeatureTitle(featureId, title) {
    const feature = features.find(f => f.id === featureId);
    if (!updateFeature({ ...feature, title })) return;

    const { newFeatures } = lists.updateFeature(featureId, { title });
    setFeatures(newFeatures);
    history.addToUndo({ id: HISTORY_ACTIONS.removeStory, params: { id: feature.id, title: feature.title } });
  }

  function updateStoryTitle(epicId, featureId, storyId, title) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;
    if (!updateStory({ ...story, title })) return;

    const { newFeatures } = lists.updateStory(featureId, storyId, { title });
    setFeatures(newFeatures);
    history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: { id: storyId.id, featureId, title } });
  }

  async function maybeRemoveEpic(epicId, addToRedo = false) {
    if (epics.length === 1) return;

    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const success = await removeEpicById(epicId);
    if (success) {
      const { newEpics, newFeatures } = lists.removeEpic(epic);
      setEpics(newEpics);
      setFeatures(newFeatures);
      const oldIndex = epics.indexOf(epic);
      const epicToFocus = newEpics[oldIndex] || newEpics[oldIndex - 1];
      setSelected({ id: epicToFocus.id, type: NOTE_TYPE.EPIC, focus: true });

      if (addToRedo) {
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_EPIC, params: [epic, epicToFocus.id] });
      } else {
        history.addToUndo({ id: HISTORY_ACTIONS.ADD_EPIC, params: [epic, epicToFocus.id] });
      }
    }
  }

  async function maybeRemoveFeature(epicId, featureId) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    const success = await removeFeatureById(epicId, featureId);
    if (success) {
      const { newEpics, newFeatures } = lists.removeFeature(feature);
      setEpics(newEpics);
      setFeatures(newFeatures);
      const oldIndex = features.indexOf(feature);
      let featureToFocus = newFeatures[oldIndex] || newFeatures[oldIndex - 1];
      setSelected({ id: featureToFocus.id, epicId, type: NOTE_TYPE.FEATURE, focus: true });
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: { feature, index: features.indexOf(feature) } });
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
      const { newFeatures } = lists.removeStory(story);
      setFeatures(newFeatures);
      const storyToFocus = feature.stories[oldIndex] || feature.stories[oldIndex - 1];
      setSelected({ id: storyToFocus.id, featureId, epicId, type: NOTE_TYPE.STORY, focus: true });
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: { story, index: feature.stories.indexOf(story) } });
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

  function getFnById(actionId) {
    const noop = () => { };

    switch (actionId) {
      case HISTORY_ACTIONS.ADD_NEW_EPIC:
        return addNewEpic;
      case HISTORY_ACTIONS.ADD_EPIC:
        return addEpic;
      case HISTORY_ACTIONS.REMOVE_EPIC:
        return maybeRemoveEpic;
      default:
        // TODO: maybe log something?
        return noop;
    }
  }

  function undo() {
    if (!history.canUndo()) return;

    const { id, params } = history.getUndo();
    const undoFn = getFnById(id);
    undoFn.apply(this, [...params, true]);
    history.undo();
  }

  function redo() {
    if (!history.canRedo()) return;

    const { id, params } = history.getRedo();
    const redoFn = getFnById(id);
    redoFn.apply(this, params);
    history.redo();
  }

  return {
    epics, features,
    addNewEpic, addNewFeature, addNewStory,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    selected, setSelected, focus,
    isFocused, setIsFocused,
    canUndo: history.canUndo, canRedo: history.canRedo,
    undo, redo,
  }
};