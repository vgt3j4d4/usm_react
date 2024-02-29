import { NOTE_TYPE } from "../../const";
import { useStoryMap } from "../../hooks/useStoryMap/useStoryMap";
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
    focusEpicAfterRemoval, focusFeatureAfterRemoval, focusStoryAfterRemoval,
    maybeNavigate,
    isFocused, setIsFocused,
  } = useStoryMap();

  const noSelectionFound = Object.keys(selected).length === 0;

  return (
    <>
      <div role="grid" className="min-w-max divide-y-2 divide-gray-400">

        {/* epics */}
        <div role="row" className="p-4 flex gap-4">
          {epics.map((e, index) => (
            <div key={e.id} className="flex gap-4">
              <Note
                id={e.id}
                title={e.title}
                type={NOTE_TYPE.EPIC}
                focusable={index === 0 && noSelectionFound}
                selected={selected.id === e.id}
                toggleFocus={(value) => { setIsFocused(value) }}
                markAsSelected={() => setSelected({ id: e.id, type: NOTE_TYPE.EPIC })}
                updateTitle={(editedTitle) => {
                  if (updateEpicTitle(e.id, editedTitle)) focus();
                }}
                add={() => { addNewEpic(e.id) }}
                remove={async () => {
                  const removedEpic = await maybeRemoveEpic(e.id);
                  if (removedEpic) focusEpicAfterRemoval(removedEpic);
                }}
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
                if (updateFeatureTitle(f.id, editedTitle)) focus();
              }}
              add={() => { addNewFeature(f.epicId, f.id) }}
              remove={async () => {
                const removedFeature = await maybeRemoveFeature(f.epicId, f.id);
                if (removedFeature) focusFeatureAfterRemoval(removedFeature);
              }}
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
                    if (updateStoryTitle(f.epicId, f.id, s.id, editedTitle)) focus();
                  }}
                  add={() => { addNewStory(f.epicId, f.id, s.id) }}
                  remove={async () => {
                    const removedStory = await maybeRemoveStory(f.epicId, f.id, s.id);
                    if (removedStory) focusStoryAfterRemoval(removedStory);
                  }}
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