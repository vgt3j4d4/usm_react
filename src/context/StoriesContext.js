import { createContext, useEffect, useRef, useState } from "react";
import { LinkedList as List } from "../classes/linked-list/LinkedList.ts";
import { StoriesServiceFactory } from "../services/StoriesService/StoriesServiceFactory.ts";

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const epicListRef = useRef(null); // parallel double linked list to epics
  const featureListRef = useRef(null); // parallel double linked list to features
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);
  const storyMapHistoryRef = useRef({ undoList: new List(), redoList: new List() });
  const storyMapIdRef = useRef(null);

  useEffect(() => {
    const retrieveState = async () => {
      const storiesService = StoriesServiceFactory.getStoriesService();
      const storyMap = storiesService.getStoryMap();
      const epics = storyMap.epics;
      const features = epics.flatMap(e => e.features);
      setEpics(epics);
      setFeatures(features);
      epicListRef.current = List.fromArray(epics);
      featureListRef.current = List.fromArray(features);
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