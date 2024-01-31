import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EPIC, DEFAULT_FEATURE, DEFAULT_STORY } from "../const";

function id() {
  return uuidv4().split('-').join('');
}

export function buildEpic() {
  return { id: id(), ...DEFAULT_EPIC, features: [buildFeature()] }
}

export function buildFeature() {
  return { id: id(), ...DEFAULT_FEATURE, stories: [buildStory()] }
}

export function buildStory() {
  return { id: id(), ...DEFAULT_STORY };
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