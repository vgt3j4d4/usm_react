import { createContext, useEffect, useState } from "react";
import * as storiesService from "../services/StoriesService";
import * as utils from "../utils/utils";

export const StoriesContext = createContext();

export default function StoriesProvider({ children }) {
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const retrieveState = async () => {
      const epics = await storiesService.getEpics();
      const features = utils.getFeatures(epics);

      setEpics([...epics]);
      setFeatures(features);
    }

    retrieveState();
  }, []);

  async function addEpic() {
    const epic = await storiesService.addEpic(utils.buildEpic());
    const newEpics = [...epics, epic];
    const newFeatures = utils.getFeatures(newEpics);
    setEpics(newEpics);
    setFeatures(newFeatures);
  }

  return (
    <StoriesContext.Provider value={{ epics, features, addEpic }}>
      {children}
    </StoriesContext.Provider>
  )
}