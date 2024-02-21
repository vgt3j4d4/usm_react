import { buildItem, getDataArray } from "../../utils/storyMapUtils";
import { addItemAtIndex } from "../../utils/utils";

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

  function addStory(story, originStoryId) {
    const featureItem = featureList.toArray().find(i => i.data.id === story.featureId);
    const feature = featureItem.data;
    if (originStoryId && feature.stories.length > 1) {
      const originStory = feature.stories.find(s => s.id === originStoryId);
      const index = feature.stories.indexOf(originStory);
      feature.stories = addItemAtIndex([...feature.stories], story, index + 1);
    } else {
      feature.stories.push(story);
    }

    return {
      newFeatures: getDataArray(featureList)
    };
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

  function removeStory(story) {
    const { data: feature } = featureList.toArray().find(i => i.data.id === story.featureId);
    feature.stories = feature.stories.filter(s => s.id !== story.id)
    return { newFeatures: getDataArray(featureList) };
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

  function updateStory(featureId, storyId, data) {
    const featureItem = featureList.toArray().find(i => i.data.id === featureId);
    featureItem.data.stories = featureItem.data.stories.map(s => s.id === storyId ? { ...s, ...data } : s);
    return { newFeatures: getDataArray(featureList) };
  }

  return {
    addEpic, addFeature, addStory,
    removeEpic, removeFeature, removeStory,
    updateEpic, updateFeature, updateStory
  }
}