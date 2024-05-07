import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { NoteContext } from "../../context/NoteContext";
import { StoriesContext } from "../../context/StoriesContext";
import { StoriesServiceFactory } from "../../services/StoriesService/StoriesServiceFactory.ts";
import { HISTORY_ACTIONS, HISTORY_OPERATION, useHistory } from "./useHistory";
import { useLists } from "./useLists";
import { useNavigation } from "./useNavigation";

export function useStoryMap() {
  const {
    epicListRef, featureListRef,
    epics, features,
    setEpics, setFeatures,
    storyMapHistoryRef,
  } = useContext(StoriesContext);
  const {
    selected, setSelected, reselect,
    isFocused, setIsFocused,
    focus
  } = useContext(NoteContext);
  const history = useHistory({ storyMapHistoryRef });
  const lists = useLists({ epicListRef, featureListRef });
  const { maybeNavigate } = useNavigation({ epics, features, selected, setSelected });

  const storiesService = StoriesServiceFactory.getStoriesService();

  async function addNewEpic(originEpicId) {
    const epic = await storiesService.addNewEpic();
    if (!epic) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);
    history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epic.id] });

    return epic;
  }

  async function addEpic(epic, originEpicId, historyOperation = HISTORY_OPERATION.NONE) {
    const epicId = await storiesService.addEpic(epic, originEpicId);
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
    const feature = await storiesService.addNewFeature(epicId);
    if (!feature) return;

    const { newFeatures } = lists.addFeature(feature, originFeatureId);
    setFeatures(newFeatures);
    history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [feature.epicId, feature.id] });

    return feature;
  }

  function addFeature(feature, originFeatureId, historyOperation = HISTORY_OPERATION.NONE) {
    const featureId = storiesService.addFeature(feature, originFeatureId);
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
    const story = await storiesService.addNewStory(epicId, featureId);
    if (!story) return;

    const { newFeatures } = lists.addStory(story, originStoryId);
    setFeatures(newFeatures);
    history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [epicId, featureId, story.id] });
  }

  async function addStory(story, originStoryId, historyOperation = HISTORY_OPERATION.NONE) {
    const storyId = await storiesService.addStory(story, originStoryId);
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

    const updatedEpicId = await storiesService.updateEpic({ ...epic, title });
    if (!updatedEpicId) return null;

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

    return updatedEpicId;
  }

  async function updateFeatureTitle(featureId, title, historyOperation = HISTORY_OPERATION.NONE) {
    const feature = features.find(f => f.id === featureId);

    const updatedFeatureId = await storiesService.updateFeature({ ...feature, title });
    if (!updatedFeatureId) return null;

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

    return updatedFeatureId;
  }

  async function updateStoryTitle(epicId, featureId, storyId, title, historyOperation = HISTORY_OPERATION.NONE) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;

    const updatedStoryId = await storiesService.updateStory({ ...story, title });
    if (!updatedStoryId) return null;

    const { newFeatures } = lists.updateStory(storyId, featureId, { title });
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

    return updatedStoryId;
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

    return removed;
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

    return removed;
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

    return removed;
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

  function focusEpicAfterRemoval(removedEpic) {
    const index = epics.findIndex(e => e.id === removedEpic.id);
    if (index !== -1) {
      const epicToFocus = index === 0 ? epics[index + 1] : epics[index - 1];
      setSelected({ id: epicToFocus.id, type: NOTE_TYPE.EPIC, focus: true });
    }
  }

  function focusFeatureAfterRemoval(removedFeature) {
    const index = features.findIndex(feature => feature.id === removedFeature.id);
    if (index !== -1) {
      let featureToFocus = index === 0 ? features[index + 1] : features[index - 1];
      if (featureToFocus.epicId !== removedFeature.epicId) {
        featureToFocus = features.find(f => f.epicId === removedFeature.epicId && f.id !== removedFeature.id);
      }
      setSelected({
        id: featureToFocus.id,
        epicId: removedFeature.epicId,
        type: NOTE_TYPE.FEATURE,
        focus: true
      });
    }
  }

  function focusStoryAfterRemoval(removedStory) {
    const feature = features.find(f => f.id === removedStory.featureId);
    const index = feature.stories.findIndex(story => story.id === removedStory.id);
    if (index !== -1) {
      const storyToFocus = index === 0 ? feature.stories[index + 1] : feature.stories[index - 1];
      setSelected({
        id: storyToFocus.id,
        epicId: removedStory.epicId,
        featureId: removedStory.featureId,
        type: NOTE_TYPE.STORY,
        focus: true
      });
    }
  }

  return {
    epics, features,
    addNewEpic, addNewFeature, addNewStory,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    selected, setSelected, reselect,
    focus, isFocused, setIsFocused,
    canUndo: history.canUndo, canRedo: history.canRedo,
    undo, redo,
    focusEpicAfterRemoval, focusFeatureAfterRemoval, focusStoryAfterRemoval
  }
};