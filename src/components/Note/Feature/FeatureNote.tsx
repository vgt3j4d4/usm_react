import React from "react";
import { NOTE_TYPE } from "../../../const.js";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap.js";
import { Feature } from "../../../models/feature.model.ts";
import { Note } from "../Note.tsx";
import { StoryNote } from "../Story/StoryNote.tsx";

interface FeatureNoteComponentProps {
  feature: Feature;
  showStories?: boolean;
  selected: { id: string };
  setSelected: (selected: any) => void;
  updateFeatureTitle: (featureId: string, title: string) => void;
  addNewFeature: (epicId: string, originFeatureId: string) => void;
  maybeRemoveFeature: (epicId: string, featureId: string) => Promise<Feature | null | undefined>;
  focusFeatureAfterRemoval: (feature: Feature) => void;
  maybeNavigate: (arrowKey: string) => void;
}

class FeatureNoteComponent extends React.Component<FeatureNoteComponentProps> {

  constructor(props: FeatureNoteComponentProps) {
    super(props);
    this.markAsSelected = this.markAsSelected.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  markAsSelected() {
    const { feature, setSelected } = this.props;
    setSelected({
      id: feature.id,
      epicId: feature.epicId,
      type: NOTE_TYPE.FEATURE
    });
  }

  updateTitle(editedTitle: any) {
    const { feature, updateFeatureTitle } = this.props;
    updateFeatureTitle(feature.id, editedTitle);
  }

  add() {
    const { feature, addNewFeature } = this.props;
    addNewFeature(feature.epicId, feature.id);
  }

  async remove() {
    const { feature, maybeRemoveFeature, focusFeatureAfterRemoval } = this.props;
    const removedFeature = await maybeRemoveFeature(feature.epicId, feature.id);
    if (removedFeature) focusFeatureAfterRemoval(feature);
  }

  navigate(arrowKey: any) {
    const { maybeNavigate } = this.props;
    maybeNavigate(arrowKey);
  }

  render() {
    const { feature, showStories, selected } = this.props;

    return (
      <>
        <Note
          id={feature.id}
          title={feature.title}
          type={NOTE_TYPE.FEATURE}
          focusable={false}
          selected={selected.id === feature.id}
          markAsSelected={this.markAsSelected}
          updateTitle={this.updateTitle}
          add={this.add}
          remove={this.remove}
          navigate={this.navigate}
        />
        {showStories && (
          <div className="py-4 flex flex-col gap-4">
            {feature.stories.map(story => <StoryNote key={story.id} story={story} />)}
          </div>
        )}
      </>
    )
  }

}

export function FeatureNote({ feature, showStories = true }) {

  const {
    addNewFeature, updateFeatureTitle,
    maybeRemoveFeature, focusFeatureAfterRemoval,
    selected, setSelected,
    maybeNavigate
  } = useStoryMap();

  return (
    <FeatureNoteComponent
      feature={feature}
      showStories={showStories}
      selected={selected}
      setSelected={setSelected}
      updateFeatureTitle={updateFeatureTitle}
      addNewFeature={addNewFeature}
      maybeRemoveFeature={maybeRemoveFeature}
      focusFeatureAfterRemoval={focusFeatureAfterRemoval}
      maybeNavigate={maybeNavigate}
    />
  )

}