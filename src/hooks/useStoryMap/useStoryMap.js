import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { NoteContext } from "../../context/NoteContext";
import { StoriesContext } from "../../context/StoriesContext";
import * as storiesService from "../../services/StoriesService";
import { HISTORY_ACTIONS, useHistory } from "./useHistory";
import { useLists } from "./useLists";
import { useNavigation } from "./useNavigation";

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
  const history = useHistory({ storyMapHistoryRef });
  const lists = useLists({ epicListRef, featureListRef });
  const { maybeNavigate } = useNavigation({ epics, features, selected, setSelected });

  const storyMapId = storyMapHistoryRef.current;

  async function addNewEpic(originEpicId, addToRedo = false) {
    const epic = await storiesService.addNewEpic(storyMapId);
    if (!epic) return;

    const { newEpics, newFeatures } = lists.addEpic(epic, originEpicId);
    if (newFeatures) setFeatures(newFeatures);
    setEpics(newEpics);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.ADD_EPIC, params: [epic, originEpicId] });
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
      history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epicId] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_EPIC, params: [epicId] });
    }
  }

  async function addNewFeature(epicId, originFeatureId, addToRedo = false) {
    const feature = await storiesService.addNewFeature(storyMapId, epicId);

    if (feature) {
      addFeature(feature, originFeatureId);

      if (addToRedo) {
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: [feature, originFeatureId] });
      } else {
        history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [epicId, feature.id] });
      }
    }
  }

  function addFeature(feature, originFeatureId, addToRedo = false) {
    const featureId = storiesService.addFeature(storyMapId, feature, originFeatureId);
    if (!featureId) return;

    const { newFeatures } = lists.addFeature(feature, originFeatureId);
    setFeatures(newFeatures);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: [feature, originFeatureId] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [feature.epicId, feature.id] });
    }
  }

  async function addNewStory(epicId, featureId, originStoryId, addToRedo = false) {
    const story = await storiesService.addNewStory(storyMapId, epicId, featureId);

    if (story) {
      const { newFeatures } = lists.addStory(story, originStoryId);
      setFeatures(newFeatures);

      if (addToRedo) {
        history.addToRedo({ id: HISTORY_ACTIONS.ADD_STORY, params: [epicId, featureId, originStoryId] });
      } else {
        history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [epicId, featureId, story.id] });
      }
    }
  }

  async function addStory(story, originStoryId, addToRedo = false) {
    const storyId = await storiesService.addStory(storyMapId, story, originStoryId);
    if (!storyId) return;

    const { newFeatures } = lists.addStory(story, originStoryId);
    setFeatures(newFeatures);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.ADD_STORY, params: [story, originStoryId] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [story.epicId, story.featureId, story.id] });
    }
  }


  async function updateEpicTitle(epicId, title, addToRedo = false) {
    const epic = epics.find(e => e.id === epicId);

    await storiesService.updateEpic({ ...epic, title });
    const { newEpics } = lists.updateEpic(epicId, { title });
    setEpics(newEpics);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: [epic.id, epic.title] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_EPIC_TITLE, params: [epic.id, epic.title] });
    }
  }

  async function updateFeatureTitle(featureId, title, addToRedo = false) {
    const feature = features.find(f => f.id === featureId);

    await storiesService.updateFeature({ ...feature, title });
    const { newFeatures } = lists.updateFeature(featureId, { title });
    setFeatures(newFeatures);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, params: [feature.id, feature.title] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_FEATURE_TITLE, params: [feature.id, feature.title] });
    }
  }

  async function updateStoryTitle(epicId, featureId, storyId, title, addToRedo = false) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;

    await storiesService.updateStory({ ...story, title });
    const { newFeatures } = lists.updateStory(featureId, storyId, { title });
    setFeatures(newFeatures);

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: [epicId, featureId, storyId, title] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.UPDATE_STORY_TITLE, params: [epicId, featureId, storyId, story.title] });
    }
  }

  async function maybeRemoveEpic(epicId, addToRedo = false) {
    if (epics.length === 1) return;

    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    await storiesService.removeEpic(epicId);
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

  async function maybeRemoveFeature(epicId, featureId, addToRedo = false) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    await storiesService.removeFeature(epicId, featureId);
    const { newEpics, newFeatures } = lists.removeFeature(feature);
    setEpics(newEpics);
    setFeatures(newFeatures);
    const oldIndex = features.indexOf(feature);
    let featureToFocus = newFeatures[oldIndex] || newFeatures[oldIndex - 1];
    setSelected({ id: featureToFocus.id, epicId, type: NOTE_TYPE.FEATURE, focus: true });

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_FEATURE, params: [epicId, featureId] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.ADD_FEATURE, params: [feature, features.indexOf(feature)] });
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId, addToRedo = false) {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.stories.length === 1) return;

    const story = feature.stories.find(s => s.id === storyId);
    if (!story) return;
    const oldIndex = feature.stories.indexOf(story);

    await storiesService.removeStory(epicId, featureId, storyId);
    const { newFeatures } = lists.removeStory(story);
    setFeatures(newFeatures);
    const storyToFocus = feature.stories[oldIndex] || feature.stories[oldIndex - 1];
    setSelected({ id: storyToFocus.id, featureId, epicId, type: NOTE_TYPE.STORY, focus: true });

    if (addToRedo) {
      history.addToRedo({ id: HISTORY_ACTIONS.REMOVE_STORY, params: [epicId, featureId, storyId] });
    } else {
      history.addToUndo({ id: HISTORY_ACTIONS.ADD_STORY, params: [story, storyToFocus.id] });
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
      case HISTORY_ACTIONS.UPDATE_EPIC_TITLE:
        return updateEpicTitle;
      case HISTORY_ACTIONS.UPDATE_FEATURE_TITLE:
        return updateFeatureTitle;
      case HISTORY_ACTIONS.UPDATE_STORY_TITLE:
        return updateStoryTitle;
      case HISTORY_ACTIONS.ADD_STORY:
        return addStory;
      default:
        console.log('Unknown actionId', actionId);
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