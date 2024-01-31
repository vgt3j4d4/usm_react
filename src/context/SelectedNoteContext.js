import { createContext, useState } from "react";

export const SelectedNoteContext = createContext();

export default function SelectedNoteProvider({ children }) {
  const [selectedMappingNote, setSelectedMappingNote] = useState({});
  const [selectedIterationNote, setSelectedIterationNote] = useState({});

  return (
    <SelectedNoteContext.Provider value={{
      selectedMappingNote, setSelectedMappingNote,
      selectedIterationNote, setSelectedIterationNote
    }}>
      {children}
    </SelectedNoteContext.Provider>
  )
}