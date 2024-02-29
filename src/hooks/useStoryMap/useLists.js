import { buildItem, getDataArray } from "../../utils/storyMapUtils";
import { insertItemAtIndex } from "../../utils/utils";

export function useLists({ epicListRef, featureListRef }) {

  const epicList = epicListRef.current;
  const featureList = featureListRef.current;

  function addEpic(epic, originEpicId) {
    const epicItem = buildItem(epic);
    let featureItem;
    featureItem = buildItem(epic.features[0]); // TODO: what if epic.features.length > 1

    const originEpicItem = epicList.toArray().find(i => i.data.id === originEpicId);
    if (originEpicItem) {
      originEpicItem.append(epicItem);
      const originEpicFeatureItems = featureList.toArray().filter(i => i.data.epicId === originEpicId);
      originEpicFeatureItems[originEpicFeatureItems.length - 1].append(featureItem);
    } else {
      epicList.prepend(epicItem);
      featureList.prepend(featureItem);
    }

    return {
      newEpics: getDataArray(epicList),
      newFeatures: getDataArray(featureList)
    };
  }

  function addFeature(feature, originFeatureId) {
    const featureItem = buildItem(feature);
    const originFeatureItem = featureList.toArray().find(i => i.data.id === originFeatureId);
    if (originFeatureItem) {
      originFeatureItem.append(featureItem);
    } else {
      featureList.prepend(featureItem);
    }

    const epicItem = epicList.toArray().find(i => i.data.id === feature.epicId);
    epicItem.data.features.push(feature);

    return {
      newEpics: getDataArray(epicList),
      newFeatures: getDataArray(featureList)
    };
  }

  const addStoryToFeatures = (features, featureId, originStoryId, story) => {
    const feature = features.find(f => f.id === featureId);
    if (originStoryId) {
      const index = feature.stories.findIndex(s => s.id === originStoryId);
      const newStories = insertItemAtIndex(feature.stories, story, index + 1);
      const newFeatures = features.map(f => f.id === featureId ? { ...f, stories: newStories } : f);
      return { newStories, newFeatures };
    } else {
      const newStories = [story, ...feature.stories];
      const newFeatures = features.map(f => f.id === featureId ? { ...f, stories: newStories } : f);
      return { newStories, newFeatures };
    }
  }

  function addStory(story, originStoryId) {
    const featureItem = featureList.toArray().find(i => i.data.id === story.featureId);
    const features = getDataArray(featureList);
    const { newStories, newFeatures } = addStoryToFeatures(features, story.featureId, originStoryId, story);
    featureItem.data.stories = newStories;
    return { newFeatures };
  }

  function removeEpic(epic) {
    const epicItem = epicList.toArray().find(i => i.data.id === epic.id);
    epicItem.detach();
    const featureItems = featureList.toArray().filter(i => i.data.epicId === epic.id);
    featureItems.every(i => i.detach());

    return {
      newEpics: getDataArray(epicList),
      newFeatures: getDataArray(featureList)
    };
  }

  function removeFeature(feature) {
    const { data: epic } = epicList.toArray().find(i => i.data.id === feature.epicId);
    epic.features = epic.features.filter(f => f.id !== feature.id);
    const featureItem = featureList.toArray().find(i => i.data.id === feature.id);
    featureItem.detach();

    return {
      newEpics: getDataArray(epicList),
      newFeatures: getDataArray(featureList)
    };
  }

  function updateEpic(epicId, data) {
    const epicItem = epicList.toArray().find(i => i.data.id === epicId);
    epicItem.data = { ...epicItem.data, ...data };
    return { newEpics: getDataArray(epicList) };
  }

  function updateFeature(featureId, data) {
    const featureItem = featureList.toArray().find(i => i.data.id === featureId);
    featureItem.data = { ...featureItem.data, ...data };
    return { newFeatures: getDataArray(featureList) };
  }

  return {
    addEpic, addFeature, addStory,
    removeEpic, removeFeature,
    updateEpic, updateFeature,
  }
}