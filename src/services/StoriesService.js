import { id, clone } from "../utils/utils";

const LOCAL_STORAGE_KEY = 'STORY_MAP';

const DEFAULT_STORY = Object.freeze({ title: 'New Story' });
const DEFAULT_FEATURE = Object.freeze({ title: 'New Feature', stories: [{ ...DEFAULT_STORY }] });
const DEFAULT_EPIC = Object.freeze({ title: 'New Epic', features: [{ ...DEFAULT_FEATURE }] });

const _storyMap = { epics: [_buildEpic()] };

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

export async function addEpic(_storyMapId) {
  const epic = _buildEpic();
  const { epics } = _storyMap;
  epics.push(epic);
  _save();

  return Promise.resolve(clone(epic));
}

export async function addFeature(_storyMapId, epicId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = _buildFeature(epicId);
    epic.features.push(feature);
    _save();

    return Promise.resolve(clone(feature));
  }
  return Promise.resolve(null);
}

export async function addStory(_storyMapId, epicId, featureId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    const feature = epic.features.find(f => f.id === featureId);
    if (feature) {
      const story = _buildStory(featureId);
      feature.stories.push(story);
      _save();

      return Promise.resolve(clone(story));
    }
  }
  return Promise.resolve(null);
}

export async function removeEpic(epicId) {
  const epic = _storyMap.epics.find(e => e.id === epicId);
  if (epic) {
    _storyMap.epics = _storyMap.epics.filter(e => e.id !== epicId);
    _save();
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
      _save();
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
        _save();
        return Promise.resolve(story);
      }
    }
  }
  return Promise.resolve(null);
}

function _save() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_storyMap));
}

function _buildEpic() {
  const epicId = id();
  return {
    id: epicId,
    ...DEFAULT_EPIC,
    features: [_buildFeature(epicId)]
  }
}

function _buildFeature(epicId) {
  const featureId = id();
  return {
    id: featureId,
    epicId: epicId,
    ...DEFAULT_FEATURE,
    stories: [_buildStory(featureId)]
  }
}

function _buildStory(featureId) {
  const storyId = id();
  return {
    id: storyId,
    featureId: featureId,
    ...DEFAULT_STORY
  };
}