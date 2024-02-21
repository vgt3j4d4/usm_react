import { List } from "linked-list";
import { createContext, useEffect, useRef, useState } from "react";
import * as storiesService from "../services/LocalStoriesService";
import { buildItem, getFeatures } from "../utils/storyMapUtils";

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const [epics, setEpics] = useState([]);
  const epicListRef = useRef(new List()); // parallel double linked list to epics
  const [features, setFeatures] = useState([]);
  const featureListRef = useRef(new List()); // parallel double linked list to features
  const storyMapHistoryRef = useRef({ undoList: new List(), redoList: new List() });
  const storyMapIdRef = useRef(null);

  useEffect(() => {
    const retrieveState = async () => {
      const storyMap = await storiesService.getStoryDefaultMap();
      const epics = [...storyMap.epics];
      const features = getFeatures(epics);
      setEpics(epics);
      epicListRef.current = List.from(epics.map(e => buildItem(e)));
      setFeatures(features);
      featureListRef.current = List.from(features.map(f => buildItem(f)));
    }

    retrieveState();
  }, []);

  return (
    <StoriesContext.Provider value={{
      epicListRef, featureListRef,
      epics, features,
      setEpics, setFeatures,
      storyMapHistoryRef,
      storyMapIdRef,
    }}>
      {children}
    </StoriesContext.Provider>
  )
}