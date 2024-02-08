import { createContext, useEffect, useState } from "react";

export const MapSelectionContext = createContext();

export default function MapSelectionProvider({ children }) {
  const [selectedNote, setSelectedNote] = useState({});

  useEffect(() => {
    if (selectedNote.id) {
      const needFocus = !!selectedNote.focus;
      if (needFocus) focus();
    }
  }, [selectedNote]); // TODO: React Hook useEffect has a missing dependency: 'focus'

  function focus() {
    if (!selectedNote.id) return;
    const note = document.querySelector(`[data-note-id="${selectedNote.id}"]`);
    if (note) note.focus();
  }

  function clear() {
    setSelectedNote({});
  }

  return (
    <MapSelectionContext.Provider value={{
      selectedNote, setSelectedNote, focus, clear
    }}>
      {children}
    </MapSelectionContext.Provider>
  )
}