import { buildEpic, buildFeature, buildStory } from "../utils/utils";

const storyMap = {
  id: null,
  epics: [buildEpic()]
};
const prefixes = {
  epics: 1,
  features: 1,
  stories: 1
};

export async function getStoryMap(_storyMapId) {
  return Promise.resolve(storyMap);
}

export async function addEpic(_storyMapId) {
  const epic = buildEpic();

  const { epics } = storyMap;
  prefixes.epics += 1;
  epic.title += ` ${prefixes.epics}`;
  prefixes.features += 1;
  const feature = epic.features[epic.features.length - 1];
  feature.title += ` ${prefixes.features}`;
  prefixes.stories += 1;
  const story = feature.stories[feature.stories.length - 1];
  story.title += ` ${prefixes.stories}`;

  epics.push(epic);
  return Promise.resolve(epic);
}

export async function addFeature(_storyMapId, epicId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = buildFeature(epicId);

    prefixes.features += 1;
    feature.title += ` ${prefixes.features}`;
    prefixes.stories += 1;
    const story = feature.stories[feature.stories.length - 1];
    story.title += ` ${prefixes.stories}`;

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

      prefixes.stories += 1;
      story.title += ` ${prefixes.stories}`;

      feature.stories.push(story);
      return Promise.resolve(story);
    }
  }
  return Promise.resolve(null);
}

export async function removeEpic(epicId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    storyMap.epics = storyMap.epics.filter(e => e.id != epicId);
    return Promise.resolve(epic);
  }
  return Promise.resolve(null);
}

export async function removeFeature(epicId, featureId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => featureId);
    if (feature) {
      epic.features = epic.features.filter(f => f.id !== featureId);
      return Promise.resolve(feature);
    }
  }
  return Promise.resolve(null);
}

export async function removeStory(epicId, featureId, storyId) {
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => featureId);
    if (feature) {
      const story = feature.stories.find(s => s.id === storyId);
      if (story) {
        feature.stories = feature.stories.filter(s => s.id !== storyId);
        return Promise.resolve(story);
      }
    }
  }
  return Promise.resolve(null);
}