export const NAVIGATION_KEYS = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

export const NOTE_TYPE = Object.freeze({
  EPIC: 'epic',
  FEATURE: 'feature',
  STORY: 'story'
})

export const DEFAULT_STORY = Object.freeze({
  id: 1,
  title: 'New Story'
});

export const DEFAULT_FEATURE = Object.freeze({
  id: 1,
  title: 'New Feature',
  stories: [{ ...DEFAULT_STORY }]
});

export const DEFAULT_EPIC = Object.freeze({
  id: 1,
  title: 'New Epic',
  features: [{ ...DEFAULT_FEATURE }]
});