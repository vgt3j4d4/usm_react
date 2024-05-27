import { VERSION } from "../../const.js";
import { Epic } from "../../models/epic.model.ts";
import { Feature } from "../../models/feature.model.ts";
import { MapData } from "../../models/mapData.model.ts";
import { Story } from "../../models/story.model.ts";
import { StoryMap } from "../../models/storyMap.model.ts";
import { ModelBuilder } from "../../utils/modelBuilder.ts";
import { id, insertItemAtIndex } from "../../utils/utils.js";
import { StoriesService } from "./StoriesService.interface.ts";

const LOCAL_STORAGE_KEY = 'USM_' + VERSION;

/**
 * Service for managing local stories data.
 */
export class LocalStoriesService implements StoriesService {

  private static instance: LocalStoriesService;

  private constructor() {
    this.initialize();
  }

  /**
   * Initializes the LocalStoriesService by creating a default story map if it doesn't exist.
   */
  private initialize() {
    let data = this.getData();
    if (!data) this.saveOrUpdate({ storyMap: this.getDefaultStoryMap() });
  }

  /**
   * Returns the default story map.
   * @returns The default story map.
   */
  private getDefaultStoryMap(): StoryMap {
    return {
      id: id(),
      epics: [ModelBuilder.buildEpic()],
      roles: []
    }
  }

  /**
   * Returns the singleton instance of LocalStoriesService.
   * @returns The singleton instance of LocalStoriesService.
   */
  public static getInstance(): LocalStoriesService {
    if (!LocalStoriesService.instance) {
      LocalStoriesService.instance = new LocalStoriesService();
    }
    return LocalStoriesService.instance;
  }

  /**
   * Retrieves the data from local storage.
   * @returns The data from local storage, or null if it doesn't exist.
   */
  getData(): MapData | null {
    const storageData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storageData) {
      return JSON.parse(storageData) as MapData;
    }
    return null;
  }

  /**
   * Saves or updates the data in local storage.
   * @param data - The data to be saved or updated.
   */
  saveOrUpdate(data: MapData) {
    const currentData = this.getData();
    if (currentData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...currentData, ...data }));
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }

  /**
   * Retrieves the story map from the data.
   * @returns The story map.
   */
  getStoryMap(): StoryMap {
    const { storyMap } = this.getData()!;
    return storyMap;
  }

  /**
   * Adds a new epic to the story map.
   * @returns A promise that resolves with the newly created epic.
   */
  async addNewEpic(): Promise<Epic> {
    const { storyMap } = this.getData()!;
    const epic = ModelBuilder.buildEpic();
    storyMap.epics.push(epic);
    this.saveOrUpdate({ storyMap });
    return Promise.resolve(epic);
  }

  /**
   * Adds a new feature to an epic.
   * 
   * @param epicId - The ID of the epic to add the feature to.
   * @param originFeatureId - (Optional) The ID of the feature after which the new feature should be inserted.
   * @returns A Promise that resolves to the newly added Feature, or null if the epic does not exist.
   */
  async addNewFeature(epicId: string, originFeatureId?: string): Promise<Feature | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === epicId);
    if (epic) {
      const feature = ModelBuilder.buildFeature(epic.id);
      if (originFeatureId) {
        const index = epic.features.findIndex(f => f.id === originFeatureId);
        epic.features = insertItemAtIndex(epic.features, feature, index + 1);
      } else epic.features.push(feature);
      this.saveOrUpdate({ storyMap });
      return Promise.resolve(feature);
    }
    return Promise.resolve(null);
  }

  /**
   * Adds a new story to the specified epic and feature.
   * 
   * @param epicId - The ID of the epic.
   * @param featureId - The ID of the feature.
   * @param originStoryId - (Optional) The ID of the origin story.
   * @returns A Promise that resolves to the newly added story, or null if the epic or feature is not found.
   */
  async addNewStory(epicId: string, featureId: string, originStoryId?: string): Promise<Story | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === featureId);
      if (feature) {
        const story = ModelBuilder.buildStory(epic.id, feature.id);
        if (originStoryId) {
          const index = feature.stories.findIndex(s => s.id === originStoryId);
          feature.stories = insertItemAtIndex(feature.stories, story, index + 1);
        } else feature.stories.push(story);
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(story);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Adds an epic to the story map after a specified origin epic.
   * 
   * @param epic - The epic to be added.
   * @param originEpicId - The ID of the origin epic after which the new epic will be added.
   * @returns A promise that resolves to the ID of the added epic.
   */
  async addEpic(epic: Epic, originEpicId: string): Promise<string> {
    const { storyMap } = this.getData()!;
    const index = storyMap.epics.findIndex(e => e.id === originEpicId);
    storyMap.epics = insertItemAtIndex(storyMap.epics, epic, index + 1);
    this.saveOrUpdate({ storyMap });
    return Promise.resolve(epic.id);
  }

  /**
   * Adds a feature to the story map.
   * 
   * @param feature - The feature to add.
   * @param originFeatureId - The ID of the feature where the new feature will be inserted after.
   * @returns A Promise that resolves to the ID of the added feature, or null if the feature couldn't be added.
   */
  async addFeature(feature: Feature, originFeatureId: string): Promise<string | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === feature.epicId);
    if (epic) {
      const index = epic.features.findIndex(f => f.id === originFeatureId);
      const featureEpic = epic.features.find(f => f.id === originFeatureId);
      if (featureEpic) {
        featureEpic.stories = insertItemAtIndex(featureEpic.stories, feature, index + 1);
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(feature.id);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Adds a new story to the story map.
   * 
   * @param story - The story object to add.
   * @param originStoryId - The ID of the story after which the new story should be inserted.
   * @returns A Promise that resolves to the ID of the added story, or null if the story could not be added.
   */
  async addStory(story: Story, originStoryId: string): Promise<string | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === story.epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === story.featureId);
      if (feature) {
        const index = feature.stories.findIndex(s => s.id === originStoryId);
        feature.stories = insertItemAtIndex(feature.stories, story, index + 1);
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(story.id);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Updates an epic in the story map.
   * @param epic - The epic object to update.
   * @returns A promise that resolves to the ID of the updated epic.
   */
  async updateEpic(epic: Epic): Promise<string> {
    const { storyMap } = this.getData()!;
    storyMap.epics = storyMap.epics.map(e => e.id === epic.id ? { ...e, ...epic } : e);
    this.saveOrUpdate({ storyMap });
    return Promise.resolve(epic.id);
  }

  /**
   * Updates a feature in the story map.
   * @param feature - The feature to be updated.
   * @returns A Promise that resolves to the ID of the updated feature, or null if the feature was not found.
   */
  async updateFeature(feature: Feature): Promise<string | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === feature.epicId);
    if (epic) {
      epic.features = epic.features.map(f => f.id === feature.id ? { ...f, ...feature } : f);
      this.saveOrUpdate({ storyMap });
      return Promise.resolve(feature.id);
    }
    return Promise.resolve(null);
  }

  /**
   * Updates a story in the story map.
   * 
   * @param story - The story object to update.
   * @returns A promise that resolves to the ID of the updated story, or null if the story was not found.
   */
  async updateStory(story: Story): Promise<string | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === story.epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === story.featureId);
      if (feature) {
        feature.stories = feature.stories.map(s => s.id === story.id ? { ...s, ...story } : s);
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(story.id);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Removes an epic from the story map.
   * @param epicId - The ID of the epic to remove.
   * @returns A promise that resolves to the removed epic, or null if the epic was not found.
   */
  async removeEpic(epicId: string): Promise<Epic | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === epicId);
    if (epic) {
      storyMap.epics = storyMap.epics.filter(e => e.id !== epicId);
      this.saveOrUpdate({ storyMap });
      return Promise.resolve(epic);
    }
    return Promise.resolve(null);
  }

  /**
   * Removes a feature from an epic.
   * @param epicId - The ID of the epic.
   * @param featureId - The ID of the feature to be removed.
   * @returns A promise that resolves to the removed feature, or null if the feature was not found.
   */
  async removeFeature(epicId: string, featureId: string): Promise<Feature | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === featureId);
      if (feature) {
        epic.features = epic.features.filter(f => f.id !== featureId);
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(feature);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Removes a story from the story map.
   * 
   * @param epicId - The ID of the epic containing the story.
   * @param featureId - The ID of the feature containing the story.
   * @param storyId - The ID of the story to be removed.
   * @returns A Promise that resolves to the removed story, or null if the story was not found.
   */
  async removeStory(epicId: string, featureId: string, storyId: string): Promise<Story | null> {
    const { storyMap } = this.getData()!;
    const epic = storyMap.epics.find(e => e.id === epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === featureId);
      if (feature) {
        const story = feature.stories.find(s => s.id === storyId);
        if (story) {
          feature.stories = feature.stories.filter(s => s.id !== storyId);
          this.saveOrUpdate({ storyMap });
          return Promise.resolve(story);
        }
      }
    }
    return Promise.resolve(null);
  }

  async swapEpics(epicId1: string, epicId2: string): Promise<boolean> {
    const { storyMap } = this.getData()!;
    const epic1Index = storyMap.epics.findIndex(e => e.id === epicId1);
    const epic2Index = storyMap.epics.findIndex(e => e.id === epicId2);
    if (epic1Index !== -1 && epic2Index !== -1) {
      const temp = storyMap.epics[epic1Index];
      storyMap.epics[epic1Index] = storyMap.epics[epic2Index];
      storyMap.epics[epic2Index] = temp;
      this.saveOrUpdate({ storyMap });
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  async swapFeatures(epicId1: string, feature1Id: string, epicId2: string, feature2Id: string): Promise<boolean> {
    const { storyMap } = this.getData()!;
    const epic1 = storyMap.epics.find(e => e.id === epicId1);
    const epic2 = storyMap.epics.find(e => e.id === epicId2);
    if (epic1 && epic2) {
      const feature1Index = epic1.features.findIndex(f => f.id === feature1Id);
      const feature2Index = epic2.features.findIndex(f => f.id === feature2Id);
      if (feature1Index !== -1 && feature2Index !== -1) {
        const temp = epic1.features[feature1Index];
        epic1.features[feature1Index] = epic2.features[feature2Index];
        epic2.features[feature2Index] = temp;
        this.saveOrUpdate({ storyMap });
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }

}