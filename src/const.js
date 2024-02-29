export const VERSION = '1.0.0';

export const DEFAULT_STORY = Object.freeze({ title: 'New Story' });
export const DEFAULT_FEATURE = Object.freeze({ title: 'New Feature', stories: [{ ...DEFAULT_STORY }] });
export const DEFAULT_EPIC = Object.freeze({ title: 'New Epic', features: [{ ...DEFAULT_FEATURE }] });

export const NOTE_TYPE = Object.freeze({
  EPIC: 'EPIC',
  FEATURE: 'FEATURE',
  STORY: 'STORY'
});

export const ARROW_KEYS = Object.freeze({
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
});