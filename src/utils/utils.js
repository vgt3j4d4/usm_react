import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EPIC, DEFAULT_FEATURE, DEFAULT_STORY } from "../const";

function id() {
  return uuidv4().split('-').join('');
}

export function buildEpic() {
  const epicId = id();
  return { id: epicId, ...DEFAULT_EPIC, features: [buildFeature(epicId)] }
}

export function buildFeature(epicId) {
  const featureId = id();
  return { id: featureId, epicId, ...DEFAULT_FEATURE, stories: [buildStory(featureId)] }
}

export function buildStory(featureId) {
  const storyId = id();
  return { id: storyId, featureId, ...DEFAULT_STORY };
}

export function getFeatures(epics = [], features = []) {
  if (epics.length > 0) {
    features = [...features, ...epics[0].features];
    return getFeatures(epics.slice(1), features);
  }
  return features;
}

export function getStories(features = [], stories = []) {
  if (features.length > 0) {
    stories = [...stories, ...features[0].stories];
    return getStories(features.slice(1), stories);
  }
  return stories;
}