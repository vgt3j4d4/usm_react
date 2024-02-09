import { createContext, useCallback, useEffect, useState } from "react";

export const MapSelectionContext = createContext();

export default function MapSelectionProvider({ children }) {
  const [selected, setSelected] = useState({});

  const focus = useCallback(() => {
    if (!selected.id) return;
    const note = document.querySelector(`[data-note-id="${selected.id}"]`);
    if (note) note.focus();
  }, [selected]);

  useEffect(() => {
    if (selected.id) {
      const needFocus = !!selected.focus;
      if (needFocus) focus();
    }
  }, [selected, focus]); // TODO: React Hook useEffect has a missing dependency: 'focus'

  return (
    <MapSelectionContext.Provider value={{
      selected, setSelected, focus
    }}>
      {children}
    </MapSelectionContext.Provider>
  )
}