import { createContext, useEffect, useState } from "react";
import * as storiesService from "../services/StoriesService";
import * as utils from "../utils/utils";

const STORY_MAP_ID = null; // TODO

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const retrieveState = async () => {
      const storyMap = await storiesService.getStoryMap(STORY_MAP_ID);
      const epics = [...storyMap.epics];
      setEpics(epics);
      setFeatures(utils.getFeatures(epics));
    }

    retrieveState();
  }, []);

  async function addEpic(originEpicId) {
    const epic = await storiesService.addEpic(STORY_MAP_ID);
    if (!epic) return;

    let newEpics, newFeatures;
    const originEpic = originEpicId ? epics.find(e => e.id === originEpicId) : null;
    if (originEpic && epics.length > 1) { // add the new epic at next to originEpic
      const originEpicIndex = epics.indexOf(originEpic);
      newEpics = utils.addItemAtIndex([...epics], epic, originEpicIndex + 1);
      const epicFeatures = features.filter(f => f.epicId === originEpic.id);
      const lastFeatureIndex = features.indexOf(epicFeatures[epicFeatures.length - 1]);
      newFeatures = utils.addItemAtIndex([...features], epic.features[0], lastFeatureIndex + 1);
      setFeatures(newFeatures);
    } else { // add epic at the end of the epics array
      newEpics = [...epics, epic];
      features.push(epic.features[0]);
    }

    setEpics(newEpics);
  }

  async function addFeature(epicId, originFeatureId) {
    const feature = await storiesService.addFeature(STORY_MAP_ID, epicId);

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
    }
  }

  async function addStory(epicId, featureId, originStoryId) {
    const story = await storiesService.addStory(STORY_MAP_ID, epicId, featureId);

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
    }
  }

  async function removeEpic(epicId) {
    const epic = epics.find(e => e.id === epicId);
    if (epic) {
      await storiesService.removeEpic(epicId);
      setEpics(epics.filter(e => e.id !== epic.id));
      setFeatures(features.filter(f => f.epicId !== epic.id));
      return true;
    }
    return false;
  }

  async function removeFeature(epicId, featureId) {
    const feature = features.find(f => f.epicId === epicId);
    if (feature) {
      await storiesService.removeFeature(epicId, featureId);
      setEpics(epics.map(e => e.id === epicId ? { ...e, features: e.features.filter(f => f.id !== featureId) } : e));
      setFeatures(features.filter(f => f.id !== featureId));
      return true;
    }
    return false;
  }

  async function removeStory(epicId, featureId, storyId) {
    const feature = features.find(f => f.id === featureId);
    const story = feature.stories.find(s => s.id === storyId);
    if (story) {
      await storiesService.removeStory(epicId, featureId, storyId);
      setFeatures(features.map(f => f.id === featureId ? { ...f, stories: f.stories.filter(s => s.id !== storyId) } : f));
      return true;
    }

    return false;
  }

  function updateEpicTitle(epicId, title) {
    setEpics(epics.map(e => e.id === epicId ? { ...e, title } : e));
  }

  function updateFeatureTitle(featureId, title) {
    setFeatures(features.map(f => f.id === featureId ? { ...f, title } : f));
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

  return (
    <StoriesContext.Provider value={{
      epics, features,
      addEpic, addFeature, addStory,
      updateEpicTitle, updateFeatureTitle, updateStoryTitle,
      removeEpic, removeFeature, removeStory
    }}>
      {children}
    </StoriesContext.Provider>
  )
}