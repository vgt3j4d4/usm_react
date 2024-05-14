import React from "react";
import { NOTE_TYPE } from "../../../const.js";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap.js";
import { Story } from "../../../models/story.model.ts";
import { Note } from "../../Note/Note.tsx";

interface StoryNoteComponentProps {
  story: Story;
  selected: { id: string };
  setSelected: (selected: any) => void;
  updateStoryTitle: (epicId: string, featureId: string, storyId: string, title: string) => void;
  addNewStory: (epicId: string, featureId: string, storyId: string) => void;
  maybeRemoveStory: (epicId: string, featureId: string, storyId: string) => Promise<Story | null | undefined>;
  focusStoryAfterRemoval: (story: any) => void;
  maybeNavigate: (arrowKey: string) => void;
}

class StoryNoteComponent extends React.Component<StoryNoteComponentProps> {

  constructor(props: StoryNoteComponentProps) {
    super(props);
    this.markAsSelected = this.markAsSelected.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  markAsSelected() {
    const { setSelected } = this.props;
    setSelected({
      id: this.props.story.id,
      epicId: this.props.story.epicId,
      featureId: this.props.story.featureId,
      type: NOTE_TYPE.STORY
    });
  }

  updateTitle(editedTitle: any) {
    const { updateStoryTitle, story } = this.props;
    updateStoryTitle(story.epicId, story.featureId, story.id, editedTitle);
  }

  add() {
    const { addNewStory, story } = this.props;
    addNewStory(story.epicId, story.featureId, story.id);
  }

  async remove() {
    const { maybeRemoveStory, focusStoryAfterRemoval, story } = this.props;
    const removedStory = await maybeRemoveStory(story.epicId, story.featureId, story.id);
    if (removedStory) focusStoryAfterRemoval(story);
  }

  navigate(arrowKey: any) {
    const { maybeNavigate } = this.props;
    maybeNavigate(arrowKey);
  }

  render() {
    const { story, selected } = this.props;

    return <Note
      id={story.id}
      title={story.title}
      type={NOTE_TYPE.STORY}
      focusable={false}
      selected={selected.id === story.id}
      markAsSelected={this.markAsSelected}
      updateTitle={this.updateTitle}
      add={this.add}
      remove={this.remove}
      navigate={this.navigate}
    />;
  }

}

export function StoryNote({ story }) {
  const {
    addNewStory, updateStoryTitle,
    maybeRemoveStory, focusStoryAfterRemoval,
    selected, setSelected,
    maybeNavigate
  } = useStoryMap();

  return (
    <StoryNoteComponent
      story={story}
      selected={selected}
      setSelected={setSelected}
      updateStoryTitle={updateStoryTitle}
      addNewStory={addNewStory}
      maybeRemoveStory={maybeRemoveStory}
      focusStoryAfterRemoval={focusStoryAfterRemoval}
      maybeNavigate={maybeNavigate}
    />
  );
}