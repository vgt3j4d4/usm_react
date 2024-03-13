import * as localStoriesService from "../services/LocalStoriesService";
import { VERSION } from "../const";

const USM_ID = `USM_${VERSION}`;

describe('LocalStoriesService', () => {

  beforeAll(() => {
    global.localStorage.clear();
  });

  it('should get empty Story Map', () => {
    expect(global.localStorage.getItem(USM_ID)).toBeNull();
  });

  it('should initialize with Default Story Map', () => {
    localStoriesService.initialize();
    const data = global.localStorage.getItem(USM_ID);
    expect(data).not.toBeNull();
    const storyMap = JSON.parse(data).storyMap;
    expect(storyMap).not.toBeNull();
    expect(storyMap.epics).toHaveLength(1);
    expect(storyMap.epics[0].features).toHaveLength(1);
    expect(storyMap.epics[0].features[0].stories).toHaveLength(1);
  });


});