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
    const newEpics = [...epics, epic];
    const newFeatures = utils.getFeatures(newEpics);
    setEpics(newEpics);
    setFeatures(newFeatures);
  }

  async function addFeature(epicId) {
    const feature = await storiesService.addFeature(STORY_MAP_ID, epicId);
    const epic = epics.find(e => e.id === epicId);
    if (epic) setFeatures([...features, feature]);
  }

  async function addStory(epicId, featureId) {
    const story = await storiesService.addStory(STORY_MAP_ID, epicId, featureId);
    if (story) setFeatures([...features]);
  }

  async function removeEpic(epicId) {
    const epic = epics.find(e => e.id === epicId);
    if (epic) {
      await storiesService.removeEpic(epicId);
      setEpics(epics.filter(e => e.id !== epic.id));
      setFeatures(features.filter(f => f.epicId !== epic.id));
    }
  }

  async function removeFeature(epicId, featureId) {

  }

  async function removeStory(epicId, featureId, storyId) {

  }

  function updateEpicTitle(epicId, title) {
    setEpics(epics.map(e => {
      if (e.id === epicId) return { ...e, title }
      return e;
    }))
  }

  function updateFeatureTitle(featureId, title) {
    setFeatures(features.map(f => {
      if (f.id === featureId) return { ...f, title }
      return f;
    }))
  }

  function updateStoryTitle(featureId, storyId, title) {
    setFeatures(features.map(f => {
      if (f.id === featureId) {
        const story = f.stories.find(s => s.id === storyId);
        if (story) {
          return {
            ...f, stories: f.stories.map(s => {
              if (s.id === storyId) return { ...s, title }
              return s
            })
          }
        }
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
        removeEpic
      }}>
      {children}
    </StoriesContext.Provider>
  )
}