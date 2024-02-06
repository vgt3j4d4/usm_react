import { createContext, useState } from "react";

export const MapSelectionContext = createContext();

export default function MapSelectionProvider({ children }) {
  const [selectedNote, setSelectedNote] = useState({});

  function focusNote() {
    if (selectedNote.id) {
      const note = document.querySelector(`[data-note-id="${selectedNote.id}"]`);
      if (note) note.focus();
    }
  }

  return (
    <MapSelectionContext.Provider value={{
      selectedNote, setSelectedNote, focusNote
    }}>
      {children}
    </MapSelectionContext.Provider>
  )
}