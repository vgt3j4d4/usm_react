import { LocalStoriesService } from "./LocalStoriesService.ts";
import { StoriesService } from "./StoriesService.interface";

export enum StoriesServiceType {
  LOCAL, REMOTE
}

export class StoriesServiceFactory {

  public static getStoriesService(type: StoriesServiceType = StoriesServiceType.LOCAL): StoriesService | null {
    switch (type) {
      case StoriesServiceType.LOCAL:
        return LocalStoriesService.getInstance();
      case StoriesServiceType.REMOTE:
      default:
        return null;
    }
  }

}