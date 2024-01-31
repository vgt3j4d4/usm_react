import { createContext, useState } from "react";

export const SelectionContext = createContext();

export default function SelectionProvider({ children }) {
  const [selectedMapNote, setSelectedMapNote] = useState({});
  const [selectedIterationNote, setSelectedIterationNote] = useState({});

  function focusMappingNote() {
    if (selectedMapNote.id) {
      const note = document.querySelector(`[data-note-id="${selectedMapNote.id}"]`);
      if (note) note.focus();
    }
  }

  function focusIterationNote() {
    if (selectedIterationNote.id) {
      const note = document.querySelector(`[data-note-id="${selectedIterationNote.id}"]`);
      if (note) note.focus();
    }
  }

  return (
    <SelectionContext.Provider value={{
      selectedMapNote, setSelectedMapNote, focusMappingNote,
      selectedIterationNote, setSelectedIterationNote, focusIterationNote
    }}>
      {children}
    </SelectionContext.Provider>
  )
}