import { buildEpic } from "../utils/utils";

const epics = [buildEpic()];

export async function getEpics() {
  return Promise.resolve(epics);
}

export async function addEpic(epic) {
  epics.push(epic);
  return Promise.resolve(epic);
}