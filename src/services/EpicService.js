import { buildEpic } from "../utils/utils";

const epics = [buildEpic()];

export async function getEpics() {
  return Promise.resolve(epics);
}