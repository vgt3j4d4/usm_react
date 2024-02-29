import { List } from "linked-list";
import { createContext, useEffect, useRef, useState } from "react";
import * as storiesService from "../services/LocalStoriesService";
import { buildItem, getFeatures } from "../utils/storyMapUtils";

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const epicListRef = useRef(new List()); // parallel double linked list to epics
  const featureListRef = useRef(new List()); // parallel double linked list to features
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);
  const storyMapHistoryRef = useRef({ undoList: new List(), redoList: new List() });
  const storyMapIdRef = useRef(null);

  useEffect(() => {
    const retrieveState = async () => {
      storiesService.initialize();
      const storyMap = storiesService.getStoryMap();
      const epics = storyMap.epics;
      const features = getFeatures(epics);
      setEpics(epics);
      setFeatures(features);
      epicListRef.current = List.from(epics.map(e => buildItem(e)));
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