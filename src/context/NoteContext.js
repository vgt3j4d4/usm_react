import { createContext, useCallback, useEffect, useState } from "react";

export const NoteContext = createContext();

export default function NoteProvider({ children }) {
  const [selected, setSelected] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const focus = useCallback(() => {
    if (!selected.id) return;
    const note = document.querySelector(`[data-note-id="${selected.id}"]`);
    if (note) note.focus({ focusVisible: true });
  }, [selected]);

  useEffect(() => {
    if (selected.id && selected.focus === true) focus({ focusVisible: true });
  }, [selected, focus]);

  return (
    <NoteContext.Provider value={{
      selected, setSelected,
      isFocused, setIsFocused,
      focus
    }}>
      {children}
    </NoteContext.Provider>
  )
}