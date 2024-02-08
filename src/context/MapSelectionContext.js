import { createContext, useEffect, useState } from "react";

export const MapSelectionContext = createContext();

export default function MapSelectionProvider({ children }) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (selected.id) {
      const needFocus = !!selected.focus;
      if (needFocus) focus();
    }
  }, [selected]); // TODO: React Hook useEffect has a missing dependency: 'focus'

  function focus() {
    if (!selected.id) return;
    const note = document.querySelector(`[data-note-id="${selected.id}"]`);
    if (note) note.focus();
  }

  function clear() { setSelected({}); }

  return (
    <MapSelectionContext.Provider value={{
      selected, setSelected, focus, clear
    }}>
      {children}
    </MapSelectionContext.Provider>
  )
}