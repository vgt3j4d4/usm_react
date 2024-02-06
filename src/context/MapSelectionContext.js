import { createContext, useEffect, useState } from "react";

export const MapSelectionContext = createContext();

export default function MapSelectionProvider({ children }) {
  const [selectedNote, setSelectedNote] = useState({});

  useEffect(() => {
    if (!!selectedNote.id && !!selectedNote.focus) {
      focusSelectedNote();
    }
  }, [selectedNote]);

  function focusSelectedNote() {
    if (selectedNote.id) {
      const note = document.querySelector(`[data-note-id="${selectedNote.id}"]`);
      if (note) note.focus();
    }
  }

  function clearSelection() {
    setSelectedNote({});
  }

  return (
    <MapSelectionContext.Provider value={{
      selectedNote, setSelectedNote, focusSelectedNote, clearSelection
    }}>
      {children}
    </MapSelectionContext.Provider>
  )
}