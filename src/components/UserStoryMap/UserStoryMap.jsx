import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { MapSelectionContext } from "../../context/MapSelectionContext";
import { Note } from "../Note/Note";
import { StoriesContext } from "../../context/StoriesContext";

function EmptyNotes({ length }) {
  if (length === 0) return null;
  return (
    Array
      .from('_'.repeat(length))
      .map((_, index) => (
        <div key={index}
          className="empty-note"
          tabIndex="-1" aria-hidden="true">
        </div>
      )));
}

export function UserStoryMap() {
  const {
    epics, features,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    removeEpic, removeFeature, removeStory
  } = useContext(StoriesContext);
  const {
    selectedNote,
    setSelectedNote,
    focusNote
  } = useContext(MapSelectionContext);

  function maybeRemoveEpic(epicId) {
    if (epics.length > 1) removeEpic(epicId);
  }

  function maybeRemoveFeature(epicId, featureId) {
    const epic = epics.find(f => f.id === epicId);
    if (epic && epic.features.length > 1) {
      removeFeature(epicId, featureId);
    }
  }

  function maybeRemoveStory(epicId, featureId, storyId) {
    const epic = epics.find(f => f.id === epicId);
    if (epic) {
      const feature = epic.features.find(f => f.id === featureId);
      if (feature && feature.stories.length > 1) {
        const story = feature.stories.find(s => s.id === storyId);
        if (story) removeStory(epicId, featureId, storyId);
      }
    }
  }

  return (
    <div role="grid" className="min-w-max divide-y">

      {/* epics */}
      <div className="p-4 flex gap-4">
        {epics.map((e, index) => (
          <div key={e.id} className="flex gap-4">
            <Note
              id={e.id}
              title={e.title}
              type={NOTE_TYPE.EPIC}
              isFirst={Object.keys(selectedNote).length === 0 && index === 0}
              selected={selectedNote.id === e.id}
              select={() => setSelectedNote({ id: e.id, type: NOTE_TYPE.EPIC })}
              updateTitle={(editedTitle) => {
                updateEpicTitle(e.id, editedTitle);
                focusNote();
              }}
              remove={() => { maybeRemoveEpic(e.id) }}>
            </Note>
            {/* to create some space between epics */}
            {e.features.length > 0 ? <EmptyNotes length={e.features.length - 1} /> : null}
          </div>
        ))}
      </div>

      {/* features */}
      <div className="p-4 flex gap-4">
        {features.map(f => (
          <Note key={f.id}
            id={f.id}
            title={f.title}
            type={NOTE_TYPE.FEATURE}
            selected={selectedNote.id === f.id}
            select={() => setSelectedNote({
              id: f.id,
              epicId: f.epicId,
              type: NOTE_TYPE.FEATURE
            })}
            updateTitle={(editedTitle) => {
              updateFeatureTitle(f.id, editedTitle);
              focusNote();
            }}
            remove={() => { maybeRemoveFeature(f.epicId, f.id) }}>
          </Note>
        ))}
      </div>

      {/* stories */}
      <div className="p-4 flex gap-4">
        {features.map(f => (
          <div key={f.id} className="flex flex-col gap-4">
            {f.stories.map(s => (
              <Note key={s.id}
                id={s.id}
                title={s.title}
                type={NOTE_TYPE.STORY}
                selected={selectedNote.id === s.id}
                select={() => setSelectedNote({
                  id: s.id,
                  epicId: f.epicId,
                  featureId: s.featureId,
                  type: NOTE_TYPE.STORY
                })}
                updateTitle={(editedTitle) => {
                  updateStoryTitle(f.id, s.id, editedTitle);
                  focusNote();
                }}
                remove={() => { maybeRemoveStory(f.epicId, f.id, s.id) }}>
              </Note>
            ))}
          </div>
        ))}
      </div>

      {selectedNote.id ? <div>Holi</div> : null}

    </div>
  )
}