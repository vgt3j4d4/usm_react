export function getFeatures(epics = [], features = []) {
  if (epics.length > 0) {
    features = [...features, ...epics[0].features];
    return getFeatures(epics.slice(1), features);
  }
  return features;
}