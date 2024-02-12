import { createContext, useEffect, useState } from "react";

const focusNote = (noteId) => {
  const el = document.querySelector(`[data-note-id="${noteId}"]`);
  if (el) el.focus({ focusVisible: true });
}

export const NoteContext = createContext();

export default function NoteProvider({ children }) {
  const [selected, setSelected] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  function focus() {
    if (!selected || !selected.id) return;
    focusNote(selected.id);
  };

  useEffect(() => {
    if (selected.id && selected.focus === true) focusNote(selected.id);
  }, [selected]);

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