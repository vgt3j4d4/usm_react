import { Note } from "../components/Note/Note";
import { NOTE_TYPE } from "../const";
import '../index.css';

export default {
  title: 'Note',
  component: Note
};

const defaultFunctionParams = {
  toggleFocus: () => console.log('toggleFocus'),
  markAsSelected: () => console.log('markAsSelected'),
  updateTitle: () => console.log('updateTitle'),
  add: () => console.log('add'),
  remove: () => console.log('remove'),
  navigate: () => console.log('navigate'),
}

export const Epic = {
  args: {
    id: '1',
    title: 'Epic Note',
    type: NOTE_TYPE.EPIC,
    ...defaultFunctionParams
  }
}

export const Feature = {
  args: {
    id: '2',
    title: 'Feature Note',
    type: NOTE_TYPE.FEATURE,
    ...defaultFunctionParams
  }
}

export const Story = {
  args: {
    id: '3',
    title: 'Story Note',
    type: NOTE_TYPE.STORY,
    ...defaultFunctionParams
  }
}

export const Selected = {
  args: {
    id: '4',
    title: 'Selected Story Note',
    type: NOTE_TYPE.STORY,
    selected: true,
    ...defaultFunctionParams
  }
}

export const FirstNote = {
  args: {
    id: '4',
    title: 'Selected Story Note',
    type: NOTE_TYPE.STORY,
    isFirst: true,
    ...defaultFunctionParams
  }
}