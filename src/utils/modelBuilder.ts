import { Epic } from "../models/epic.model";
import { Feature } from "../models/feature.model";
import { Story } from "../models/story.model";
import { id } from "./utils";

const DEFAULT_STORY: Story = { id: '', epicId: '', featureId: '', title: 'New Story', };
const DEFAULT_FEATURE: Feature = { id: '', epicId: '', title: 'New Feature', stories: [] };
const DEFAULT_EPIC: Epic = { id: '', title: 'New Epic', features: [] }

export class ModelBuilder {

  static storyCount = 0;
  static featureCount = 0;
  static epicCount = 0;

  static buildStory(epicId: string, featureId: string): Story {
    const defaultStory = { ...DEFAULT_STORY };
    const title = ModelBuilder.storyCount === 0 ? defaultStory.title : `${defaultStory.title} ${ModelBuilder.storyCount}`;
    ModelBuilder.storyCount++;
    return {
      ...defaultStory,
      title,
      id: id(),
      epicId,
      featureId
    }
  }

  static buildFeature(epicId: string): Feature {
    const defaultFeature = { ...DEFAULT_FEATURE };
    const featureId = id();
    const title = ModelBuilder.featureCount === 0 ? defaultFeature.title : `${defaultFeature.title} ${ModelBuilder.featureCount}`;
    ModelBuilder.featureCount++;
    return {
      ...DEFAULT_FEATURE,
      title,
      id: featureId,
      epicId,
      stories: [ModelBuilder.buildStory(epicId, featureId)]
    }
  }

  static buildEpic(): Epic {
    const defaultEpic = { ...DEFAULT_EPIC };
    const epicId = id();
    const title = ModelBuilder.epicCount === 0 ? defaultEpic.title : `${defaultEpic.title} ${ModelBuilder.epicCount}`;
    ModelBuilder.epicCount++;
    return {
      ...DEFAULT_EPIC,
      title,
      id: epicId,
      features: [ModelBuilder.buildFeature(epicId)]
    }
  }

}