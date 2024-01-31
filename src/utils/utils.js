import { DEFAULT_EPIC, DEFAULT_FEATURE, DEFAULT_STORY, NOTE_TYPE } from "../const";
import { v4 as uuidv4 } from 'uuid';

export function buildEpic() {
  return { id: uuidv4(), ...DEFAULT_EPIC, features: [buildFeature()] }
}

export function buildFeature() {
  return { id: uuidv4(), ...DEFAULT_FEATURE, stories: [buildStory()] }
}

export function buildStory() {
  return { id: uuidv4(), ...DEFAULT_STORY };
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
    return getFeatures(features.slice(1), stories);
  }
  return stories;
}