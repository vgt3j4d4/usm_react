import { useEffect, useRef, useState } from "react";
import { selectTextWithin } from "../utils/utils";

export function useNote(defaultEditing = false) {

  const [editing, setEditing] = useState(defaultEditing);
  const titleRef = useRef(null);

  useEffect(() => {
    if (editing) {
      const titleEl = titleRef.current;
      if (titleEl) {
        titleEl.focus();
        selectTextWithin(titleEl);
      }
    }
  }, [editing]);

  return {
    editing, setEditing,
    titleRef
  }
}