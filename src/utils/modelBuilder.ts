import { Epic } from "../models/epic.model";
import { Feature } from "../models/feature.model";
import { Story } from "../models/story.model";
import { id } from "./utils";

const DEFAULT_STORY: Story = {
  id: '',
  epicId: '',
  featureId: '',
  title: 'New Story',
};

const DEFAULT_FEATURE: Feature = {
  id: '',
  epicId: '',
  title: 'New Feature',
  stories: []
};

const DEFAULT_EPIC: Epic = {
  id: '',
  title: 'New Epic',
  features: []
}

export class ModelBuilder {

  static buildStory(epicId: string, featureId: string): Story {
    return {
      ...DEFAULT_STORY,
      id: id(),
      epicId,
      featureId
    }
  }

  static buildFeature(epicId: string): Feature {
    const featureId = id();
    return {
      ...DEFAULT_FEATURE,
      id: featureId,
      epicId,
      stories: [ModelBuilder.buildStory(epicId, featureId)]
    }
  }

  static buildEpic(): Epic {
    const epicId = id();
    return {
      ...DEFAULT_EPIC,
      id: epicId,
      features: [ModelBuilder.buildFeature(epicId)]
    }
  }

}