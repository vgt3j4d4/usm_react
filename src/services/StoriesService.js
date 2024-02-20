import { id, clone } from "../utils/utils";
import { addItemAtIndex } from "../utils/utils";

const LOCAL_STORAGE_KEY = 'STORY_MAP';

const DEFAULT_STORY = Object.freeze({ title: 'New Story' });
const DEFAULT_FEATURE = Object.freeze({ title: 'New Feature', stories: [{ ...DEFAULT_STORY }] });
const DEFAULT_EPIC = Object.freeze({ title: 'New Epic', features: [{ ...DEFAULT_FEATURE }] });

const _storyMap = { epics: [buildEpic()] };

export async function getStoryDefaultMap() {
  let storyMap = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storyMap) {
    storyMap = JSON.parse(storyMap);
    _storyMap.epics = storyMap.epics;
  } else {
    storyMap = { ..._storyMap };
  }

  return Promise.resolve(clone(storyMap));
}

export async function addNewEpic(_storyMapId) {
  const epic = buildEpic();
  const { epics } = _storyMap;
  epics.push(epic);
  save();

  return Promise.resolve(clone(epic));
}

export async function addNewFeature(_storyMapId, epicId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = buildFeature(epicId);
    epic.features.push(feature);
    save();

    return Promise.resolve(clone(feature));
  }
  return Promise.resolve(null);
}

export async function addNewStory(_storyMapId, epicId, featureId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      const story = buildStory(epicId, featureId);
      feature.stories.push(story);
      save();

      return Promise.resolve(clone(story));
    }
  }
  return Promise.resolve(null);
}

export async function removeEpic(epicId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    _storyMap.epics = _storyMap.epics.filter(e => e.id !== epicId);
    save();
    return Promise.resolve(epic);
  }
  return Promise.resolve(null);
}

export async function removeFeature(epicId, featureId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => featureId);
    if (feature) {
      epic.features = epic.features.filter(f => f.id !== featureId);
      save();
      return Promise.resolve(feature);
    }
  }
  return Promise.resolve(null);
}

export async function removeStory(epicId, featureId, storyId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => featureId);
    if (feature) {
      const story = feature.stories.find(s => s.id === storyId);
      if (story) {
        feature.stories = feature.stories.filter(s => s.id !== storyId);
        save();
        return Promise.resolve(story);
      }
    }
  }
  return Promise.resolve(null);
}

export async function addEpic(_storyMapId, epic, originEpicId) {
  const { epics } = _storyMap;
  _storyMap.epics = addItemAtIndex(epics, epic, epics.indexOf(originEpicId) + 1);
  save();
  return Promise.resolve(epic.id);
}

export async function updateEpic(epic) {
  const { epics } = _storyMap;
  _storyMap.epics = epics.map(e => e.id === epic.id ? { ...e, ...epic } : e);
  save();
  return Promise.resolve(epic.id);
}

export async function updateFeature(feature) {
  const { epics } = _storyMap;
  const epic = epics.find(e => e.id === feature.epicId);
  epic.features = epic.features.map(f => f.id === feature.id ? { ...f, ...feature } : f);
  _storyMap.epics = epics;
  save();
  return Promise.resolve(feature.id);
}

export async function updateStory(story) {
  const { epics } = _storyMap;
  const epic = epics.find(e => e.id === story.epicId);
  const feature = epic.features.find(f => f.id === story.featureId);
  feature.stories = feature.stories.map(s => s.id === story.id ? { ...s, ...story } : s);
  _storyMap.epics = epics;
  save();
  return Promise.resolve(story.id);
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_storyMap));
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