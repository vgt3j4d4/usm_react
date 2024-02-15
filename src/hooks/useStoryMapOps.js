import { addItemAtIndex } from "../utils/utils";

export function useStoryMapOps({ epics, features }) {

  function addToEpics(epic, originEpicId) {
    let newEpics, newFeatures;

    const originEpic = epics.find(e => e.id === originEpicId);
    if (epics.length > 1) { // add the new epic at next to originEpic
      const originEpicIndex = epics.indexOf(originEpic);
      newEpics = addItemAtIndex([...epics], epic, originEpicIndex + 1);
      const epicFeatures = features.filter(f => f.epicId === originEpic.id);
      const lastFeatureIndex = features.indexOf(epicFeatures[epicFeatures.length - 1]);
      newFeatures = addItemAtIndex([...features], epic.features[0], lastFeatureIndex + 1);
    } else { // add epic at the end of the epics array
      newEpics = [...epics, epic];
      features.push(epic.features[0]);
    }

    return { newEpics, newFeatures };
  }

  function addToFeatures(feature, originFeatureId) {
    let newFeatures;
    const originFeature = originFeatureId ? features.find(f => f.id === originFeatureId) : null;
    if (originFeature && features.length > 1) {
      const index = features.indexOf(originFeature);
      newFeatures = addItemAtIndex([...features], feature, index + 1);
    } else {
      newFeatures = [...features, feature];
    }

    const epic = epics.find(e => e.id === feature.epicId);
    epic.features.push(feature);

    return { newEpics: epics, newFeatures };
  }

  function addToStories(story, originStoryId) {
    let newFeatures;
    const feature = features.find(f => f.id === story.featureId);
    if (originStoryId && feature.stories.length > 1) {
      const originStory = feature.stories.find(s => s.id === originStoryId);
      const index = feature.stories.indexOf(originStory);
      newFeatures = features.map(f =>
        f.id === story.featureId ? { ...f, stories: addItemAtIndex([...f.stories], story, index + 1) } : f
      );
    } else {
      newFeatures = features.map(f =>
        f.id === story.featureId ? { ...f, stories: [...f.stories, story] } : f
      );
    }

    return { newFeatures };
  }

  function removeFromEpics(epic) {
    const newEpics = epics.filter(e => e.id !== epic.id);
    const newFeatures = features.filter(f => f.epicId !== epic.id);
    return { newEpics, newFeatures };
  }

  function removeFromFeatures(feature) {
    const newEpics = epics.map(e => e.id === feature.epicId ? { ...e, features: e.features.filter(f => f.id !== feature.id) } : e);
    const newFeatures = features.filter(f => f.id !== feature.id);
    return { newEpics, newFeatures };
  }

  function removeFromStories(story) {
    const newFeatures = features.map(f => f.id === story.featureId ? { ...f, stories: f.stories.filter(s => s.id !== story.id) } : f);
    return { newFeatures };
  }

  function updateEpic(epicId, data) {
    const newEpics = epics.map(e => e.id === epicId ? { ...e, ...data } : e)
    return { newEpics };
  }

  function updateFeature(featureId, data) {
    const newFeatures = features.map(f => f.id === featureId ? { ...f, ...data } : f)
    return { newFeatures };
  }

  function updateStory(featureId, storyId, data) {
    const newFeatures = features.map(f => {
      if (f.id === featureId) {
        const story = f.stories.find(s => s.id === storyId);
        if (story) return { ...f, stories: f.stories.map(s => s.id === storyId ? { ...s, ...data } : s) }
      }
      return f;
    });
    return { newFeatures };
  }

  return {
    addToEpics, addToFeatures, addToStories,
    removeFromEpics, removeFromFeatures, removeFromStories,
    updateEpic, updateFeature, updateStory
  }
}