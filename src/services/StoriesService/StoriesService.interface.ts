import { Epic } from "../../models/epic.model";
import { Feature } from "../../models/feature.model";
import { MapData } from "../../models/mapData.model";
import { Story } from "../../models/story.model";
import { StoryMap } from "../../models/storyMap.model";

export interface StoriesService {

  getData(): MapData | null;

  saveOrUpdate(data: MapData): void;

  getStoryMap(): StoryMap;

  addNewEpic(): Promise<Epic>;

  addNewFeature(epicId: string, originFeatureId?: string): Promise<Feature | null>;

  addNewStory(epicId: string, featureId: string, originStoryId?: string): Promise<Story | null>;

  addEpic(epic: Epic, originEpicId: string): Promise<string>;

  addFeature(feature: Feature, originFeatureId: string): Promise<string | null>;

  addStory(story: Story, originStoryId: string): Promise<string | null>;

  updateEpic(epic: Epic): Promise<string>;

  updateFeature(feature: Feature): Promise<string | null>;

  updateStory(story: Story): Promise<string | null>;

  removeEpic(epicId: string): Promise<Epic | null>;

  removeFeature(epicId: string, featureId: string): Promise<Feature | null>;

  removeStory(epicId: string, featureId: string, storyId: string): Promise<Story | null>;

  swapEpics(epic1Id: string, epic2Id: string): Promise<boolean>;

}