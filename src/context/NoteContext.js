import { createContext, useEffect, useState } from "react";
import { focusNoteById } from "../utils/storyMapUtils";

export const NoteContext = createContext();

export default function NoteProvider({ children }) {
  const [selected, setSelected] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selected.id && selected.focus === true) focusNoteById(selected.id);
  }, [selected]);

  function focus() {
    if (!selected || !selected.id) return;
    focusNoteById(selected.id);
  };

  function reselect() {
    setSelected({ ...selected, focus: true });
  }

  return (
    <NoteContext.Provider value={{
      selected, setSelected, reselect,
      isFocused, setIsFocused,
      focus
    }}>
      {children}
    </NoteContext.Provider>
  )
}