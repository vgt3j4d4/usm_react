import { useEffect, useRef, useState } from "react";
import { selectTextWithin } from "../utils/utils";

export function useNote() {

  const [editing, setEditing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (editing) {
      const noteEl = titleRef.current;
      if (noteEl) {
        noteEl.focus();
        selectTextWithin(noteEl);
      }
    }
  }, [editing]);

  return {
    editing, setEditing,
    titleRef
  }
}