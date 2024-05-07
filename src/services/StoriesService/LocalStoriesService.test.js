import { VERSION } from "../../const";
import { ModelBuilder } from "../../utils/modelBuilder.ts";
import { LocalStoriesService } from "./LocalStoriesService.ts";

describe('LocalStoriesService', () => {

  const USM_ID = `USM_${VERSION}`;
  const localStorage = window.localStorage;
  const storiesService = LocalStoriesService.getInstance();

  function getStoryMap() {
    const data = localStorage.getItem(USM_ID);
    return JSON.parse(data).storyMap;
  }

  beforeEach(() => {
    localStorage.clear();
    storiesService.initialize();
  });

  it('should get empty Story Map', () => {
    localStorage.clear();
    expect(localStorage.getItem(USM_ID)).toBeNull();
  });

  it('should initialize with Default Story Map', () => {
    const storyMap = getStoryMap();
    expect(storyMap.epics).toHaveLength(1);
    expect(storyMap.epics[0].features).toHaveLength(1);
    expect(storyMap.epics[0].features[0].stories).toHaveLength(1);
  });

  it('should add new epic', async () => {
    await storiesService.addNewEpic();

    const storyMap = getStoryMap();
    expect(storyMap.epics).toHaveLength(2);
  });

  it('should add new feature', async () => {
    const storyMap = getStoryMap();
    const epicId = storyMap.epics[0].id;

    await storiesService.addNewFeature(epicId);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const epic = updatedStoryMap.epics.find(epic => epic.id === epicId);
    expect(epic).not.toBeNull();
    expect(epic.features).toHaveLength(2);
  });

  it('should add new story', async () => {
    const storyMap = getStoryMap();
    const epicId = storyMap.epics[0].id;
    const featureId = storyMap.epics[0].features[0].id;

    await storiesService.addNewStory(epicId, featureId);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const epic = updatedStoryMap.epics.find(epic => epic.id === epicId);
    expect(epic).not.toBeNull();
    const feature = epic.features.find(feature => feature.id === featureId);
    expect(feature).not.toBeNull();
    expect(feature.stories).toHaveLength(2);
  });


  it('should add epic', async () => {
    const storyMap = getStoryMap();
    const epic = ModelBuilder.buildEpic();

    await storiesService.addEpic(epic, storyMap.epics[0].id);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    expect(updatedStoryMap.epics).toHaveLength(2);
  });

  it('should remove epic', async () => {
    const storyMap = getStoryMap();
    const epicId = storyMap.epics[0].id;

    await storiesService.removeEpic(epicId);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    expect(updatedStoryMap.epics).toHaveLength(0);
  });

  it('should remove feature', async () => {
    const storyMap = getStoryMap();
    const epicId = storyMap.epics[0].id;
    const featureId = storyMap.epics[0].features[0].id;

    await storiesService.removeFeature(epicId, featureId);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const epic = updatedStoryMap.epics.find(epic => epic.id === epicId);
    expect(epic).not.toBeNull();
    expect(epic.features).toHaveLength(0);
  });

  it('should remove story', async () => {
    const storyMap = getStoryMap();
    const epicId = storyMap.epics[0].id;
    const featureId = storyMap.epics[0].features[0].id;
    const storyId = storyMap.epics[0].features[0].stories[0].id;

    await storiesService.removeStory(epicId, featureId, storyId);

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const epic = updatedStoryMap.epics.find(epic => epic.id === epicId);
    expect(epic).not.toBeNull();
    const feature = epic.features.find(feature => feature.id === featureId);
    expect(feature).not.toBeNull();
    expect(feature.stories).toHaveLength(0);
  });

  it('should update epic', async () => {
    const storyMap = getStoryMap();
    const epic = storyMap.epics[0];

    await storiesService.updateEpic({ ...epic, title: 'Updated Epic' });

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const updatedEpic = updatedStoryMap.epics.find(e => e.id === epic.id);
    expect(updatedEpic).not.toBeNull();
    expect(updatedEpic.title).toBe('Updated Epic');
  });

  it('should update feature', async () => {
    const storyMap = getStoryMap();
    const epic = storyMap.epics[0];
    const feature = epic.features[0];

    await storiesService.updateFeature({ ...feature, title: 'Updated Feature' });

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const updatedEpic = updatedStoryMap.epics.find(e => e.id === epic.id);
    expect(updatedEpic).not.toBeNull();
    const updatedFeature = updatedEpic.features.find(f => f.id === feature.id);
    expect(updatedFeature).not.toBeNull();
    expect(updatedFeature.title).toBe('Updated Feature');
  });

  it('should update story', async () => {
    const storyMap = getStoryMap();
    const epic = storyMap.epics[0];
    const feature = epic.features[0];
    const story = feature.stories[0];

    await storiesService.updateStory({ ...story, title: 'Updated Story' });

    const updatedStoryMap = getStoryMap();
    expect(updatedStoryMap).not.toBeNull();
    const updatedEpic = updatedStoryMap.epics.find(e => e.id === epic.id);
    expect(updatedEpic).not.toBeNull();
    const updatedFeature = updatedEpic.features.find(f => f.id === feature.id);
    expect(updatedFeature).not.toBeNull();
    const updatedStory = updatedFeature.stories.find(s => s.id === story.id);
    expect(updatedStory).not.toBeNull();
    expect(updatedStory.title).toBe('Updated Story');
  });

});