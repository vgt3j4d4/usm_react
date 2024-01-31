import { createContext, useState } from "react";

export const SelectedNoteContext = createContext();

export default function SelectedNoteProvider({ children }) {
  const [selectedMappingNote, setSelectedMappingNote] = useState({});
  const [selectedIterationNote, setSelectedIterationNote] = useState({});

  function focusMappingNote() {
    if (selectedMappingNote.id) {
      const note = document.querySelector(`[data-note-id="${selectedMappingNote.id}"]`);
      if (note) note.focus();
    }
  }

  return (
    <SelectedNoteContext.Provider value={{
      selectedMappingNote, setSelectedMappingNote, focusMappingNote,
      selectedIterationNote, setSelectedIterationNote
    }}>
      {children}
    </SelectedNoteContext.Provider>
  )
}