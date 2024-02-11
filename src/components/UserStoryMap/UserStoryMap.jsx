import { useContext } from "react";
import { NOTE_TYPE } from "../../const";
import { NoteContext } from "../../context/NoteContext";
import { StoriesContext } from "../../context/StoriesContext";
import { useStoryMap } from "../../hooks/useStoryMap";
import { Note } from "../Note/Note";
import { VisualArrowKeys } from "../VisualArrowKeys/VisualArrowKeys";
import { isMobile } from "../../utils/utils";

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
    addEpic, addFeature, addStory,
    selected, setSelected, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    isFocused, setIsFocused
  } = useStoryMap({
    ...useContext(StoriesContext), ...useContext(NoteContext)
  });

  return (
    <>
      <div role="grid" className="min-w-max divide-y">

        {/* epics */}
        <div role="row" className="p-4 flex gap-4">
          {epics.map((e, index) => (
            <div key={e.id} className="flex gap-4">
              <Note
                id={e.id}
                title={e.title}
                type={NOTE_TYPE.EPIC}
                isFirst={Object.keys(selected).length === 0 && index === 0}
                selected={selected.id === e.id}
                toggleFocus={(isFocused) => { setIsFocused(isFocused) }}
                markAsSelected={() => setSelected({ id: e.id, type: NOTE_TYPE.EPIC })}
                updateTitle={(editedTitle) => {
                  if (editedTitle && editedTitle !== e.title) updateEpicTitle(e.id, editedTitle);
                  focus();
                }}
                add={() => { addEpic(e.id) }}
                remove={() => { maybeRemoveEpic(e.id) }}
                navigate={maybeNavigate}>
              </Note>
              {/* to create some space between epics */}
              {e.features.length > 1 ? <EmptyNotes length={e.features.length - 1} /> : null}
            </div>
          ))}
        </div>

        {/* features */}
        <div role="row" className="p-4 flex gap-4">
          {features.map(f => (
            <Note key={f.id}
              id={f.id}
              title={f.title}
              type={NOTE_TYPE.FEATURE}
              selected={selected.id === f.id}
              toggleFocus={(isFocused) => { setIsFocused(isFocused) }}
              markAsSelected={() => setSelected({ id: f.id, epicId: f.epicId, type: NOTE_TYPE.FEATURE })}
              updateTitle={(editedTitle) => {
                if (editedTitle && editedTitle !== f.title) updateFeatureTitle(f.id, editedTitle);
                focus();
              }}
              add={() => { addFeature(f.epicId, f.id) }}
              remove={() => { maybeRemoveFeature(f.epicId, f.id) }}
              navigate={maybeNavigate}>
            </Note>
          ))}
        </div>

        {/* stories */}
        <div role="row" className="p-4 flex gap-4">
          {features.map(f => (
            <div key={f.id} className="flex flex-col gap-4">
              {f.stories.map(s => (
                <Note key={s.id}
                  id={s.id}
                  title={s.title}
                  type={NOTE_TYPE.STORY}
                  selected={selected.id === s.id}
                  toggleFocus={(isFocused) => { setIsFocused(isFocused) }}
                  markAsSelected={() =>
                    setSelected({
                      id: s.id, epicId: f.epicId, featureId: s.featureId, type: NOTE_TYPE.STORY
                    })
                  }
                  updateTitle={(editedTitle) => {
                    if (editedTitle && editedTitle !== s.title) updateStoryTitle(f.id, s.id, editedTitle);
                    focus();
                  }}
                  add={() => { addStory(f.epicId, f.id, s.id) }}
                  remove={() => { maybeRemoveStory(f.epicId, f.id, s.id) }}
                  navigate={maybeNavigate}>
                </Note>
              ))}
            </div>
          ))}
        </div>

      </div >

      {isFocused && !isMobile() ? <VisualArrowKeys /> : null}
    </>
  )
}