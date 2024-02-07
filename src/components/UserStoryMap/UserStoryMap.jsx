import { useContext, useState } from "react";
import { ARROW_KEYS, NOTE_TYPE } from "../../const";
import { MapSelectionContext } from "../../context/MapSelectionContext";
import { StoriesContext } from "../../context/StoriesContext";
import { Note } from "../Note/Note";

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

function VisualArrowKeys() {
  // TODO: just render this on desktop
  return (
    <div className="fixed bottom-0 left-0 max-w-24 max-h-24 z-10">
      <img src="/images/black_keys.png"></img>
    </div>
  )
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
    focusSelectedNote,
    clearSelection
  } = useContext(MapSelectionContext);
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  async function maybeRemoveEpic(epicId) {
    const success = await removeEpic(epicId);
    if (success) {
      clearSelection();
      setIsNoteFocused(false);
    }
  }

  async function maybeRemoveFeature(epicId, featureId) {
    const success = await removeFeature(epicId, featureId);
    if (success) {
      clearSelection();
      setIsNoteFocused(false);
    }
  }

  async function maybeRemoveStory(epicId, featureId, storyId) {
    const success = await removeStory(epicId, featureId, storyId);
    if (success) {
      clearSelection();
      setIsNoteFocused(false);
    }
  }

  function maybeNavigate(arrowKey) {
    let epic, feature, story;
    let index, toFocus;

    switch (selectedNote.type) {
      case NOTE_TYPE.EPIC:
        epic = epics.find(e => e.id === selectedNote.id);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.DOWN:
            feature = epic.features[0];
            setSelectedNote({
              id: feature.id,
              epicId: epic.id,
              type: NOTE_TYPE.FEATURE,
              focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            index = epics.indexOf(epic);
            if (index === 0) return;

            toFocus = epics[index - 1];
            setSelectedNote({
              id: toFocus.id,
              type: NOTE_TYPE.EPIC,
              focus: true
            });
            break;
          case ARROW_KEYS.RIGHT:
            index = epics.indexOf(epic);
            if (index === (epics.length - 1)) return;

            toFocus = epics[index + 1];
            setSelectedNote({
              id: toFocus.id,
              type: NOTE_TYPE.EPIC,
              focus: true
            });
            break;
        }
        break;
      case NOTE_TYPE.FEATURE:
        feature = features.find(f => f.id === selectedNote.id);
        if (!feature) return;
        epic = epics.find(e => e.id === selectedNote.epicId);
        if (!epic) return;

        switch (arrowKey) {
          case ARROW_KEYS.UP:
            toFocus = epic;
            setSelectedNote({
              id: toFocus.id,
              type: NOTE_TYPE.EPIC,
              focus: true
            });
            break;
          case ARROW_KEYS.DOWN:
            toFocus = feature.stories[0];
            setSelectedNote({
              id: toFocus.id,
              featureId: feature.id,
              epicId: feature.epicId,
              type: NOTE_TYPE.STORY,
              focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === 0) return;

            toFocus = features[index - 1];
            setSelectedNote({
              id: toFocus.id,
              epicId: epic.id,
              type: NOTE_TYPE.FEATURE,
              focus: true
            });
            break;
          case ARROW_KEYS.RIGHT:
            if (features.length === 1) return;
            index = features.indexOf(feature);
            if (index === (features.length - 1)) return;

            toFocus = features[index + 1];
            setSelectedNote({
              id: toFocus.id,
              epicId: epic.id,
              type: NOTE_TYPE.FEATURE,
              focus: true
            });
            break;
        }
        break;
      case NOTE_TYPE.STORY:
        feature = features.find(f => f.id === selectedNote.featureId);
        if (!feature) return;
        story = feature.stories.find(s => s.id === selectedNote.id);
        if (!story) return;

        index = feature.stories.indexOf(story);
        switch (arrowKey) {
          case ARROW_KEYS.UP:
            toFocus = index === 0 ? feature : feature.stories[index - 1];
            setSelectedNote({
              id: toFocus.id,
              epicId: toFocus.epicId,
              type: NOTE_TYPE.FEATURE,
              focus: true
            });
            break;
          case ARROW_KEYS.DOWN:
            if (index === (feature.stories.length - 1)) return;
            toFocus = feature.stories[index + 1];
            setSelectedNote({
              id: toFocus.id,
              featureId: toFocus.featureId,
              epicId: feature.epicId,
              type: NOTE_TYPE.STORY,
              focus: true
            });
            break;
          case ARROW_KEYS.LEFT:
            index = features.indexOf(feature);
            if (index === 0) return;

            const previousFeature = features[index - 1];
            index = feature.stories.indexOf(story);
            if (index <= (previousFeature.stories.length - 1)) {
              toFocus = previousFeature.stories[index];
            } else {
              toFocus = previousFeature.stories[previousFeature.stories.length - 1];
            }
            setSelectedNote({
              id: toFocus.id,
              featureId: feature.id,
              epicId: feature.epicId,
              type: NOTE_TYPE.STORY,
              focus: true
            });
            break;
          case ARROW_KEYS.RIGHT:
            index = features.indexOf(feature);
            if (index === (features.length - 1)) return;

            const nextFeature = features[index + 1];
            index = feature.stories.indexOf(story);
            if (index <= (nextFeature.stories.length - 1)) {
              toFocus = nextFeature.stories[index];
            } else {
              toFocus = nextFeature.stories[nextFeature.stories.length - 1];
            }
            setSelectedNote({
              id: toFocus.id,
              featureId: feature.id,
              epicId: feature.epicId,
              type: NOTE_TYPE.STORY,
              focus: true
            });
            break;
        }
        break;
    }
  }

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
                isFirst={Object.keys(selectedNote).length === 0 && index === 0}
                selected={selectedNote.id === e.id}
                toggleFocus={(isFocused) => { setIsNoteFocused(isFocused) }}
                markAsSelected={() =>
                  setSelectedNote({ id: e.id, type: NOTE_TYPE.EPIC })
                }
                updateTitle={(editedTitle) => {
                  if (editedTitle && editedTitle !== e.title) {
                    updateEpicTitle(e.id, editedTitle);
                  }
                  focusSelectedNote();
                }}
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
              selected={selectedNote.id === f.id}
              toggleFocus={(isFocused) => { setIsNoteFocused(isFocused) }}
              markAsSelected={() =>
                setSelectedNote({
                  id: f.id,
                  epicId: f.epicId,
                  type: NOTE_TYPE.FEATURE
                })
              }
              updateTitle={(editedTitle) => {
                if (editedTitle && editedTitle !== f.title) {
                  updateFeatureTitle(f.id, editedTitle);
                }
                focusSelectedNote();
              }}
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
                  selected={selectedNote.id === s.id}
                  toggleFocus={(isFocused) => { setIsNoteFocused(isFocused) }}
                  markAsSelected={() =>
                    setSelectedNote({
                      id: s.id,
                      epicId: f.epicId,
                      featureId: s.featureId,
                      type: NOTE_TYPE.STORY
                    })
                  }
                  updateTitle={(editedTitle) => {
                    if (editedTitle && editedTitle !== s.title) {
                      updateStoryTitle(f.id, s.id, editedTitle);
                    }
                    focusSelectedNote();
                  }}
                  remove={() => { maybeRemoveStory(f.epicId, f.id, s.id) }}
                  navigate={maybeNavigate}>
                </Note>
              ))}
            </div>
          ))}
        </div>

      </div >

      {isNoteFocused ? <VisualArrowKeys /> : null}
    </>
  )
}