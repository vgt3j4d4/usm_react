import { useContext, useEffect, useState } from "react";
import { NOTE_TYPE } from "../../const";
import { SelectedNoteContext } from "../../context/SelectedNoteContext";
import { getEpics } from "../../services/EpicService";
import { getFeatures, getStories } from "../../utils/utils";
import { Note } from "../Note/Note";

export function UserStoryMap() {
  const [epics, setEpics] = useState([]);
  const [features, setFeatures] = useState([]);
  const [stories, setStories] = useState([]);

  const {
    selectedMappingNote: selectedNote,
    setSelectedMappingNote: setSelectedNote
  } = useContext(SelectedNoteContext);

  useEffect(() => {
    const retrieveState = async () => {
      const data = await getEpics();
      setEpics(data);
      const features = getFeatures(data);
      setFeatures(getFeatures(data));
      const stories = getStories(features);
      setStories(stories);
    }
    retrieveState();
  }, []);

  return (
    <div role="grid" className="divide-y">

      {/* epics */}
      <div className="p-4 flex gap-4">
        {epics.map((e, index) => (
          <Note key={e.id}
            id={e.id}
            title={e.title}
            type={NOTE_TYPE.EPIC}
            isFirst={Object.keys(selectedNote).length === 0 && index === 0}
            selected={selectedNote.id === e.id}
            select={() => setSelectedNote({ id: e.id, type: NOTE_TYPE.EPIC })}>
          </Note>
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
            select={() => setSelectedNote({ id: f.id, type: NOTE_TYPE.FEATURE })}>
          </Note>
        ))}
      </div>

      {/* stories */}
      <div className="p-4">
        {stories.map(s => (
          <Note key={s.id}
            id={s.id}
            title={s.title}
            type={NOTE_TYPE.STORY}
            selected={selectedNote.id === s.id}
            select={() => setSelectedNote({ id: s.id, type: NOTE_TYPE.STORY })}>
          </Note>
        ))}
      </div>

    </div>
  )
}