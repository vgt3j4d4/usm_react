import { buildEpic, buildFeature, buildStory } from "../utils/utils";

const storyMap = {
  id: null,
  epics: [buildEpic()]
};

export async function getStoryMap(_storyMapId) {
  return Promise.resolve(storyMap);
}

export async function addEpic(_storyMapId) {
  const epic = buildEpic();
  epic.title += ` ${storyMap.epics.length + 1}`;
  storyMap.epics.push(epic);
  return Promise.resolve(epic);
}

export async function addFeature(_storyMapId, epicId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = buildFeature(epicId);
    feature.title += ` ${epic.features.length + 1}`;
    epic.features.push(feature);
    return Promise.resolve(feature);
  }
  return Promise.resolve(null);
}

export async function addStory(_storyMapId, epicId, featureId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      const story = buildStory(featureId);
      story.title += ` ${feature.stories.length + 1}`;
      feature.stories.push(story);
      return Promise.resolve(story);
    }
  }
  return Promise.resolve(null);
}