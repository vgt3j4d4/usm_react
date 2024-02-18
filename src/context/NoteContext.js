import { createContext, useEffect, useState } from "react";
import { focusNoteById } from "../utils/storyMapUtils";

export const NoteContext = createContext();

export default function NoteProvider({ children }) {
  const [selected, setSelected] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  function focus() {
    if (!selected || !selected.id) return;
    focusNoteById(selected.id);
  };

  useEffect(() => {
    if (selected.id && selected.focus === true) focusNoteById(selected.id);
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