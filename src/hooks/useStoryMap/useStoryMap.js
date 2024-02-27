import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { NoteContext } from "../../context/NoteContext";
import { StoriesContext } from "../../context/StoriesContext";
import * as storiesService from "../../services/LocalStoriesService";
import { HISTORY_ACTIONS, HISTORY_OPERATION, useHistory } from "./useHistory";
import { useLists } from "./useLists";
import { useNavigation } from "./useNavigation";

export function useStoryMap() {
  const {
    epicListRef, featureListRef,
    epics, features,
    setEpics, setFeatures,
    storyMapHistoryRef,
    storyMapIdRef
  } = useContext(StoriesContext);
  const {
    selected, setSelected,
    isFocused, setIsFocused,
    focus
  } = useContext(NoteContext);
  const history = useHistory({ storyMapHistoryRef });
  const lists = useLists({ epicListRef, featureListRef });
  const { maybeNavigate } = useNavigation({ epics, features, selected, setSelected });

  const storyMapId = storyMapIdRef.current;

  async function addNewEpic(originEpicId) {
    const epic = await storiesService.addNewEpic(storyMapId);
    if (!epic) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);
    history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epic.id] });
  }

  async function addEpic(epic, originEpicId, historyOperation = HISTORY_OPERATION.NONE) {
    const epicId = await storiesService.addEpic(storyMapId, epic, originEpicId);
    if (!epicId) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epicId] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epicId] });
        break;
    }
  }

  async function addNewFeature(epicId, originFeatureId) {
    const feature = await storiesService.addNewFeature(storyMapId, epicId);
    if (!feature) return;

    if (feature) {
      const { newFeatures } = lists.addFeature(feature, originFeatureId);
      setFeatures(newFeatures);
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [feature.epicId, feature.id] });
    }
  }

  function addFeature(feature, originFeatureId, historyOperation = HISTORY_OPERATION.NONE) {
    const featureId = storiesService.addFeature(storyMapId, feature, originFeatureId);
    if (!featureId) return;

    const { newFeatures } = lists.addFeature(feature, originFeatureId);
    setFeatures(newFeatures);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [feature.epicId, feature.id] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [feature.epicId, feature.id] });
        break;
    }
  }

  async function addNewStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addNewStory(storyMapId, epicId, featureId);
    if (!story) return;

    const { newFeatures } = lists.addStory(story, originStoryId);
    setFeatures(newFeatures);
    history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [epicId, featureId, story.id] });
  }

  async function addStory(story, originStoryId, historyOperation = HISTORY_OPERATION.NONE) {
    const storyId = await storiesService.addStory(storyMapId, story, originStoryId);
    if (!storyId) return;

    const { newFeatures } = lists.addStory(story, originStoryId);
    setFeatures(newFeatures);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [story.epicId, story.featureId, story.id] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [story.epicId, story.featureId, story.id] });
        break;
    }
  }

  async function updateEpicTitle(epicId, title, historyOperation = HISTORY_OPERATION.NONE) {
    const epic = epics.find(e => e.id === epicId);

    await storiesService.updateEpic({ ...epic, title });
    const { newEpics } = lists.updateEpic(epicId, { title });
    setEpics(newEpics);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: [epic.id, epic.title] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: [epic.id, epic.title] });
        break;
    }
  }

  async function updateFeatureTitle(featureId, title, historyOperation = HISTORY_OPERATION.NONE) {
    const feature = features.find(f => f.id === featureId);

    await storiesService.updateFeature({ ...feature, title });
    const { newFeatures } = lists.updateFeature(featureId, { title });
    setFeatures(newFeatures);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, params: [feature.id, feature.title] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, params: [feature.id, feature.title] });
        break;
    }
  }

  async function updateStoryTitle(epicId, featureId, storyId, title, historyOperation = HISTORY_OPERATION.NONE) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;

    await storiesService.updateStory({ ...story, title });
    const { newFeatures } = lists.updateStory(featureId, storyId, { title });
    setFeatures(newFeatures);

    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: [epicId, featureId, storyId, title] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: [epicId, featureId, storyId, story.title] });
        break;
    }
  }

  async function maybeRemoveEpic(epicId, historyOperation = HISTORY_OPERATION.NONE) {
    if (epics.length === 1) return;

    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const removed = await storiesService.removeEpic(epicId);
    const { newEpics, newFeatures } = lists.removeEpic(epic);
    setEpics(newEpics);
    setFeatures(newFeatures);
    const oldIndex = epics.indexOf(epic);
    const epicToFocus = newEpics[oldIndex] || newEpics[oldIndex - 1];
    setSelected({ id: epicToFocus.id, type: NOTE_TYPE.EPIC, focus: true });

    const originEpicId = (newEpics[oldIndex - 1] || {}).id;
    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_EPIC, params: [removed, originEpicId] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.ADD_EPIC, params: [removed, originEpicId] });
        break;
    }
  }

  async function maybeRemoveFeature(epicId, featureId, historyOperation = HISTORY_OPERATION.NONE) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    const removed = await storiesService.removeFeature(epicId, featureId);
    const { newEpics, newFeatures } = lists.removeFeature(feature);
    setEpics(newEpics);
    setFeatures(newFeatures);
    const oldIndex = features.indexOf(feature);
    let featureToFocus = newFeatures[oldIndex] || newFeatures[oldIndex - 1];
    setSelected({ id: featureToFocus.id, epicId, type: NOTE_TYPE.FEATURE, focus: true });

    const originFeatureId = (newFeatures[oldIndex - 1] || {}).id;
    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: [removed, originFeatureId] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: [removed, originFeatureId] });
        break;
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId, historyOperation = HISTORY_OPERATION.NONE) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.stories.length === 1) return;

    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;
    const oldIndex = feature.stories.indexOf(story);

    const removed = await storiesService.removeStory(epicId, featureId, storyId);
    const { newFeatures } = lists.removeStory(story);
    setFeatures(newFeatures);
    const storyToFocus = feature.stories[oldIndex] || feature.stories[oldIndex - 1];
    setSelected({ id: storyToFocus.id, featureId, epicId, type: NOTE_TYPE.STORY, focus: true });

    const originStoryId = (feature.stories[oldIndex - 1] || {}).id;
    switch (historyOperation) {
      case HISTORY_OPERATION.UNDO:
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_STORY, params: [removed, originStoryId] });
        break;
      case HISTORY_ACTIONS.REDO:
      default: // NONE
        history.addToUndo({ id: HISTORY_ACTIONS.ADD_STORY, params: [removed, originStoryId] });
        break;
    }
  }

  function getFnById(actionId) {
    const noop = () => { };

    switch (actionId) {
      case HISTORY_ACTIONS.ADD_EPIC:
        return addEpic;
      case HISTORY_ACTIONS.ADD_FEATURE:
        return addFeature;
      case HISTORY_ACTIONS.ADD_STORY:
        return addStory;
      case HISTORY_ACTIONS.REMOVE_EPIC:
        return maybeRemoveEpic;
      case HISTORY_ACTIONS.REMOVE_FEATURE:
        return maybeRemoveFeature;
      case HISTORY_ACTIONS.REMOVE_STORY:
        return maybeRemoveStory;
      case HISTORY_ACTIONS.UPDATE_EPIC_TITLE:
        return updateEpicTitle;
      case HISTORY_ACTIONS.UPDATE_FEATURE_TITLE:
        return updateFeatureTitle;
      case HISTORY_ACTIONS.UPDATE_STORY_TITLE:
        return updateStoryTitle;
      default:
        return noop;
    }
  }

  function undo() {
    if (!history.canUndo()) return;

    const { id, params } = history.getUndo();
    const undoFn = getFnById(id);
    undoFn.apply(this, [...params, HISTORY_OPERATION.UNDO]);
    history.undo();
  }

  function redo() {
    if (!history.canRedo()) return;

    const { id, params } = history.getRedo();
    const redoFn = getFnById(id);
    redoFn.apply(this, [...params, HISTORY_OPERATION.REDO]);
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