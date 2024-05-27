import React from "react";
import { NOTE_TYPE } from "../../../const";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap.js";
import { Epic } from "../../../models/epic.model.ts";
import { FeatureNote } from "../Feature/FeatureNote.tsx";
import { Note } from "../Note.tsx";

interface EpicNoteComponentProps {
  epic: Epic;
  showFeatures?: boolean;
  focusable: boolean;
  selected: { id: string };
  setSelected: (selected: any) => void;
  updateEpicTitle: (epicId: string, title: string) => void;
  addNewEpic: (originEpicId: string) => void;
  maybeRemoveEpic: (epicId: string) => Promise<Epic | null | undefined>;
  focusEpicAfterRemoval: (epic: Epic) => void;
  maybeNavigate: (arrowKey: string) => void;
}

class EpicNoteComponent extends React.Component<EpicNoteComponentProps> {

  constructor(props: EpicNoteComponentProps) {
    super(props);
    this.markAsSelected = this.markAsSelected.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  markAsSelected() {
    const { setSelected } = this.props;
    setSelected({ id: this.props.epic.id, type: NOTE_TYPE.EPIC });
  }

  updateTitle(editedTitle: any) {
    const { updateEpicTitle, epic } = this.props;
    updateEpicTitle(epic.id, editedTitle);
  }

  add() {
    const { addNewEpic, epic } = this.props;
    addNewEpic(epic.id);
  }

  async remove() {
    const { maybeRemoveEpic, focusEpicAfterRemoval, epic } = this.props;
    const removedEpic = await maybeRemoveEpic(epic.id);
    if (removedEpic) focusEpicAfterRemoval(epic);
  }

  navigate(arrowKey: any) {
    const { maybeNavigate } = this.props;
    maybeNavigate(arrowKey);
  }

  render() {
    const { epic, showFeatures, selected, focusable } = this.props;

    return (
      <>
        <Note
          id={epic.id}
          title={epic.title}
          type={NOTE_TYPE.EPIC}
          focusable={focusable}
          selected={selected.id === epic.id}
          markAsSelected={this.markAsSelected}
          updateTitle={this.updateTitle}
          add={this.add}
          remove={this.remove}
          navigate={this.navigate}
        />
        {showFeatures && (
          <div className="flex gap-4">
            {epic.features.map(f => <FeatureNote key={f.id} feature={f} />)}
          </div>
        )}
      </>);
  }
}

export function EpicNote({ epic, showFeatures = true, focusable }) {
  const {
    addNewEpic, updateEpicTitle,
    maybeRemoveEpic, focusEpicAfterRemoval,
    selected, setSelected,
    maybeNavigate
  } = useStoryMap();

  return (
    <EpicNoteComponent
      epic={epic}
      showFeatures={showFeatures}
      focusable={focusable}
      selected={selected}
      setSelected={setSelected}
      updateEpicTitle={updateEpicTitle}
      addNewEpic={addNewEpic}
      maybeRemoveEpic={maybeRemoveEpic}
      focusEpicAfterRemoval={focusEpicAfterRemoval}
      maybeNavigate={maybeNavigate}
    />
  )
}