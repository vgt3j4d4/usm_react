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

  return (
    <StoriesContext.Provider value={{ epics, features, addEpic, addFeature, addStory }}>
      {children}
    </StoriesContext.Provider>
  )
}