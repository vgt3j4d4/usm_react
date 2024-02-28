import { DEFAULT_EPIC, DEFAULT_FEATURE, DEFAULT_STORY, VERSION } from "../const";
import { addItemAtIndex, clone, id } from "../utils/utils";

const LOCAL_STORAGE_KEY = 'USM_' + VERSION;

function getDefaultStoryMap() {
  return {
    id: id(),
    epics: [buildEpic()]
  };
}

function getData() {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : null;
}

function saveOrUpdate(data) {
  const storedData = getData();
  if (storedData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...storedData, ...data }));
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}

function buildEpic() {
  const epicId = id();
  return {
    id: epicId,
    ...DEFAULT_EPIC,
    features: [buildFeature(epicId)]
  }
}

function buildFeature(epicId) {
  const featureId = id();
  return {
    id: featureId,
    epicId: epicId,
    ...DEFAULT_FEATURE,
    stories: [buildStory(epicId, featureId)]
  }
}

function buildStory(epicId, featureId) {
  const storyId = id();
  return {
    id: storyId,
    epicId,
    featureId,
    ...DEFAULT_STORY
  };
}

export function initialize() {
  let data = getData();
  if (!data) {
    data = { storyMap: getDefaultStoryMap() };
    saveOrUpdate(data);
  }
}

export function getStoryMap() {
  const { storyMap } = getData();
  return clone(storyMap);
}

export async function addNewEpic(_storyMapId) {
  const { storyMap } = getData();
  const epic = buildEpic();
  storyMap.epics.push(epic);
  saveOrUpdate({ storyMap });
  return Promise.resolve(clone(epic));
}

export async function addEpic(_storyMapId, epic, originEpicId) {
  const { storyMap } = getData();
  const index = storyMap.epics.findIndex(e => e.id === originEpicId);
  storyMap.epics = addItemAtIndex(storyMap.epics, epic, index + 1);
  saveOrUpdate({ storyMap });
  return Promise.resolve(epic.id);
}

export async function addNewFeature(_storyMapId, epicId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = buildFeature(epicId);
    epic.features.push(feature);
    saveOrUpdate({ storyMap });
    return Promise.resolve(clone(feature));
  }
  return Promise.resolve(null);
}

export async function addFeature(_storyMapId, feature, originFeatureId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === feature.epicId);
  const index = epic.features.findIndex(f => f.id === originFeatureId);
  epic.features = addItemAtIndex(epic.features, feature, index + 1);
  saveOrUpdate({ storyMap });
  return Promise.resolve(feature.id);
}

export async function addNewStory(_storyMapId, epicId, featureId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      const story = buildStory(epicId, featureId);
      feature.stories.push(story);
      saveOrUpdate({ storyMap });
      return Promise.resolve(clone(story));
    }
  }
  return Promise.resolve(null);
}

export async function addStory(_storyMapId, story, originStoryId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === story.epicId);
  const feature = epic.features.find(f => f.id === story.featureId);
  if (originStoryId) {
    const index = feature.stories.findIndex(s => s.id === originStoryId);
    feature.stories = addItemAtIndex(feature.stories, story, index + 1);
  } else {
    feature.stories = [story, ...feature.stories];
  }
  saveOrUpdate({ storyMap });
  return Promise.resolve(story.id);
}

export async function removeEpic(epicId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    storyMap.epics = storyMap.epics.filter(e => e.id !== epicId);
    saveOrUpdate({ storyMap });
    return Promise.resolve(clone(epic));
  }
  return Promise.resolve(null);
}

export async function removeFeature(epicId, featureId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      epic.features = epic.features.filter(f => f.id !== featureId);
      saveOrUpdate({ storyMap });
      return Promise.resolve(clone(feature));
    }
  }
  return Promise.resolve(null);
}

export async function removeStory(epicId, featureId, storyId) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      const storyIndex = feature.stories.findIndex(s => s.id === storyId);
      const story = feature.stories[storyIndex];
      if (storyIndex !== -1) {
        feature.stories.splice(storyIndex, 1);
        saveOrUpdate({ storyMap });
        return Promise.resolve(clone(story));
      }
    }
  }
  return Promise.resolve(null);
}

export async function updateEpic(epic) {
  const { storyMap } = getData();
  storyMap.epics = storyMap.epics.map(e => e.id === epic.id ? { ...e, ...epic } : e);
  saveOrUpdate({ storyMap });
  return Promise.resolve(epic.id);
}

export async function updateFeature(feature) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === feature.epicId);
  epic.features = epic.features.map(f => f.id === feature.id ? { ...f, ...feature } : f);
  saveOrUpdate({ storyMap });
  return Promise.resolve(feature.id);
}

export async function updateStory(story) {
  const { storyMap } = getData();
  const epic = storyMap.epics.find(e => e.id === story.epicId);
  const feature = epic.features.find(f => f.id === story.featureId);
  feature.stories = feature.stories.map(s => s.id === story.id ? { ...s, ...story } : s);
  saveOrUpdate({ storyMap });
  return Promise.resolve(story.id);
}