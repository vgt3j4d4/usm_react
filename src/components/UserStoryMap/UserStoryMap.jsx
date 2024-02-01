import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { SelectionContext } from "../../context/SelectionContext";
import { Note } from "../Note/Note";
import { StoriesContext } from "../../context/StoriesContext";

function EpicSpacer({ length }) {
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
  const { epics, features } = useContext(StoriesContext);
  const {
    selectedMapNote: selectedNote,
    setSelectedMapNote: setSelectedNote
  } = useContext(SelectionContext);

  return (
    <div role="grid" className="divide-y">

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
              select={() => setSelectedNote({ id: e.id, type: NOTE_TYPE.EPIC })}>
            </Note>
            {/* to create some space between epics */}
            <EpicSpacer length={e.features.length - 1} />
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
              type: NOTE_TYPE.FEATURE,
              parentId: f.epicId
            })}>
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
                  type: NOTE_TYPE.STORY,
                  parentId: s.featureId
                })}>
              </Note>
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}