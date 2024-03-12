import { ListItem as Item } from "../../classes/linked-list/ListItem.ts";
import { insertItemAtIndex } from "../../utils/utils";

export function useLists({ epicListRef, featureListRef }) {

  const epicList = epicListRef.current;
  const featureList = featureListRef.current;

  function addEpic(epic, originEpicId) {
    const epicItem = new Item(epic);
    let featureItem;
    featureItem = new Item(epic.features[0]); // TODO: what if epic.features.length > 1

    const originEpicItem = epicList.find(i => i.data.id === originEpicId);
    if (originEpicItem) {
      originEpicItem.append(epicItem);
      const originEpicFeatureItems = featureList.toArray().filter(i => i.data.epicId === originEpicId);
      originEpicFeatureItems[originEpicFeatureItems.length - 1].append(featureItem);
    } else {
      epicList.prepend(epicItem);
      featureList.prepend(featureItem);
    }

    return {
      newEpics: epicList.toDataArray(),
      newFeatures: featureList.toDataArray()
    };
  }

  function addFeature(feature, originFeatureId) {
    const featureItem = new Item(feature);
    const originFeatureItem = featureList.find(i => i.data.id === originFeatureId);
    if (originFeatureItem) {
      originFeatureItem.append(featureItem);
    } else {
      featureList.prepend(featureItem);
    }

    const epicItem = epicList.find(i => i.data.id === feature.epicId);
    epicItem.data.features.push(feature);

    return {
      newEpics: epicList.toDataArray(),
      newFeatures: featureList.toDataArray()
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
    const featureItem = featureList.find(i => i.data.id === story.featureId);
    const features = featureList.toDataArray();
    const { newStories, newFeatures } = addStoryToFeatures(features, story.featureId, originStoryId, story);
    featureItem.data.stories = newStories;
    return { newFeatures };
  }

  function removeEpic(epic) {
    const epicItem = epicList.find(i => i.data.id === epic.id);
    epicItem.detach();
    const featureItems = featureList.toArray().filter(i => i.data.epicId === epic.id);
    featureItems.every(i => i.detach());

    return {
      newEpics: epicList.toDataArray(),
      newFeatures: featureList.toDataArray()
    };
  }

  function removeFeature(feature) {
    const { data: epic } = epicList.find(i => i.data.id === feature.epicId);
    epic.features = epic.features.filter(f => f.id !== feature.id);
    const featureItem = featureList.find(i => i.data.id === feature.id);
    featureItem.detach();

    return {
      newEpics: epicList.toDataArray(),
      newFeatures: featureList.toDataArray()
    };
  }

  function removeStory(story) {
    const featureItem = featureList.find(i => i.data.id === story.featureId);
    const newStories = featureItem.data.stories.filter(s => s.id !== story.id);
    const features = featureList.toDataArray();
    const newFeatures = features.map(f => f.id === story.featureId ? { ...f, stories: newStories } : f);
    featureItem.data.stories = newStories;
    return { newFeatures };
  }

  function updateEpic(epicId, data) {
    const epicItem = epicList.find(i => i.data.id === epicId);
    epicItem.data = { ...epicItem.data, ...data };
    return { newEpics: epicList.toDataArray() };
  }

  function updateFeature(featureId, data) {
    const featureItem = featureList.find(i => i.data.id === featureId);
    featureItem.data = { ...featureItem.data, ...data };
    return { newFeatures: featureList.toDataArray() };
  }

  function updateStory(storyId, featureId, data) {
    const featureItem = featureList.find(i => i.data.id === featureId);
    const newStories = featureItem.data.stories.map(s => s.id === storyId ? { ...s, ...data } : s);
    featureItem.data.stories = newStories;
    return { newFeatures: featureList.toDataArray() };
  }

  return {
    addEpic, addFeature, addStory,
    removeEpic, removeFeature, removeStory,
    updateEpic, updateFeature, updateStory,
  }
}