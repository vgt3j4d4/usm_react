import { useEffect, useState } from "react";
import { buildEpic, buildFeature, buildStory, getAllFeatures, getAllStories, getNoteId } from "../../utils/utils";
import { Note } from "../Note/Note";
import { NOTE_TYPE } from "../../const";

const INITIAL_EPIC = buildEpic();

export function UserStoryMap() {
  const [epics, setEpics] = useState([INITIAL_EPIC]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // const features = getAllFeatures(epics);
  const features = [buildFeature()];
  // const stories = getAllStories(epics);
  const stories = [buildStory()];

  return (
    <div role="grid" className="divide-y">
      {/* epics */}
      <div className="p-4">
        {epics.map((e, index) => (
          <Note key={e.id}
            id={getNoteId(e.id, NOTE_TYPE.EPIC)}
            title={e.title}
            type={NOTE_TYPE.EPIC}
            active={activeNoteId === getNoteId(e.id, NOTE_TYPE.EPIC)}
            isFirst={activeNoteId === null && index === 0}
            activate={() => setActiveNoteId(getNoteId(e.id, NOTE_TYPE.EPIC))}>
          </Note>
        ))}
      </div>

      {/* features */}
      <div className="p-4">
        {features.map(f => (
          <Note key={f.id}
            id={getNoteId(f.id, NOTE_TYPE.FEATURE)}
            title={f.title}
            type={NOTE_TYPE.FEATURE}
            active={activeNoteId === getNoteId(f.id, NOTE_TYPE.FEATURE)}
            activate={() => setActiveNoteId(getNoteId(f.id, NOTE_TYPE.FEATURE))}>
          </Note>
        ))}
      </div>

      {/* stories */}
      <div className="p-4">
        {stories.map(s => (
          <Note key={s.id}
            id={getNoteId(s.id, NOTE_TYPE.STORY)}
            title={s.title}
            type={NOTE_TYPE.STORY}
            active={activeNoteId === getNoteId(s.id, NOTE_TYPE.STORY)}
            activate={() => setActiveNoteId(getNoteId(s.id, NOTE_TYPE.STORY))}>
          </Note>
        ))}
      </div>
    </div>
  )
}