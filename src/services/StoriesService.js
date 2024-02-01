import { buildEpic } from "../utils/utils";

const epics = [buildEpic()];

export async function getEpics() {
  return Promise.resolve(epics);
}

export async function addEpic(epic) {
  epics.push(epic);
  return Promise.resolve(epic);
}

export async function addFeature(feature) {
  const epic = epics.find(e => e.id === feature.epicId);
  if (epic) epic.features.push(feature);
  return Promise.resolve(feature);
}