import { NOTE_TYPE } from "../../const";
import { useStoryMap } from "../../hooks/useStoryMap";
import { isMobileOrTablet } from "../../utils/utils";
import { ArrowKeys } from "../ArrowKeys/ArrowKeys";
import { EmptyNotes } from "../EmptyNotes/EmptyNotes";
import { Note } from "../Note/Note";

export function StoryMap() {
  const {
    epics, features,
    updateEpicTitle, updateFeatureTitle, updateStoryTitle,
    addNewEpic, addNewFeature, addNewStory,
    selected, setSelected, focus,
    maybeRemoveEpic, maybeRemoveFeature, maybeRemoveStory,
    maybeNavigate,
    isFocused, setIsFocused
  } = useStoryMap();

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
                focusable={index === 0 && Object.keys(selected).length === 0}
                selected={selected.id === e.id}
                toggleFocus={(value) => { setIsFocused(value) }}
                markAsSelected={() => setSelected({ id: e.id, type: NOTE_TYPE.EPIC })}
                updateTitle={(editedTitle) => {
                  updateEpicTitle(e.id, editedTitle);
                  focus();
                }}
                add={() => { addNewEpic(e.id) }}
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
              toggleFocus={(value) => { setIsFocused(value) }}
              markAsSelected={() => setSelected({ id: f.id, epicId: f.epicId, type: NOTE_TYPE.FEATURE })}
              updateTitle={(editedTitle) => {
                updateFeatureTitle(f.id, editedTitle);
                focus();
              }}
              add={() => { addNewFeature(f.epicId, f.id) }}
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
                  toggleFocus={(value) => { setIsFocused(value) }}
                  markAsSelected={() =>
                    setSelected({ id: s.id, epicId: f.epicId, featureId: s.featureId, type: NOTE_TYPE.STORY })
                  }
                  updateTitle={(editedTitle) => {
                    updateStoryTitle(f.epicId, f.id, s.id, editedTitle);
                    focus();
                  }}
                  add={() => { addNewStory(f.epicId, f.id, s.id) }}
                  remove={() => { maybeRemoveStory(f.epicId, f.id, s.id) }}
                  navigate={maybeNavigate}>
                </Note>
              ))}
            </div>
          ))}
        </div>

      </div >

      {isFocused && !isMobileOrTablet() ? <ArrowKeys /> : null}
    </>
  )
}