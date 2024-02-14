import { createContext, useEffect, useRef, useState } from "react";
import * as storiesService from "../services/StoriesService";
import * as utils from "../utils/utils";

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);
  const storiesRef = useRef({ index: undefined, actions: [/** { id: '', params: {} } */] });
  const storyMapIdRef = useRef(null);

  useEffect(() => {
    const retrieveState = async () => {
      const storyMap = await storiesService.getStoryDefaultMap();
      const epics = [...storyMap.epics];
      setEpics(epics);
      setFeatures(utils.getFeatures(epics));
    }

    retrieveState();
  }, []);

  return (
    <StoriesContext.Provider value={{
      epics, features,
      setEpics, setFeatures,
      storiesRef,
      storyMapIdRef,
    }}>
      {children}
    </StoriesContext.Provider>
  )
}