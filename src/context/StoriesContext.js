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

  async function addEpic() {
    const epic = await storiesService.addEpic(STORY_MAP_ID);
    setEpics([...epics, epic]);
    setFeatures([...features, ...epic.features]);
  }

  async function addFeature(epicId) {
    const feature = await storiesService.addFeature(STORY_MAP_ID, epicId);
    if (feature) {
      setEpics(epics.map(e => e.id === feature.epicId ? { ...e, features: [...e.features, feature] } : e));
      setFeatures([...features, feature]);
    }
  }

  async function addStory(epicId, featureId) {
    const story = await storiesService.addStory(STORY_MAP_ID, epicId, featureId);
    if (story) {
      setFeatures(features.map(f =>
        f.id === featureId ? { ...f, stories: [...f.stories, story] } : f
      ));
    }
  }

  async function removeEpic(epicId) {
    if (epics.length === 1) return false;

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
    const epic = epics.find(e => e.id === epicId);
    if (!epic || epic.features.length === 1) return false;

    const feature = features.find(f => f.epicId === epicId);
    if (feature) {
      await storiesService.removeFeature(epicId, featureId);
      setEpics(epics.map(e => e.id === epic.id ? { ...e, features: e.features.filter(f => f.id !== featureId) } : e));
      setFeatures(features.filter(f => f.id !== featureId));
      return true;
    }
    return false;
  }

  async function removeStory(epicId, featureId, storyId) {
    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.stories.length === 1) return false;

    const story = feature.stories.find(s => s.id === storyId);
    if (story) {
      await storiesService.removeStory(epicId, featureId, storyId);
      setFeatures(features.map(f => f === feature ? { ...f, stories: f.stories.filter(s => s.id !== storyId) } : f));
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
    <StoriesContext.Provider value={
      {
        epics, features,
        addEpic, addFeature, addStory,
        updateEpicTitle, updateFeatureTitle, updateStoryTitle,
        removeEpic, removeFeature, removeStory
      }}>
      {children}
    </StoriesContext.Provider>
  )
}