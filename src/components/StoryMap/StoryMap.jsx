import { useEffect, useMemo } from "react";
import { useStoryMap } from "../../hooks/useStoryMap/useStoryMap";
import { isMobileOrTablet } from "../../utils/utils";
import { ArrowKeys } from "../ArrowKeys/ArrowKeys";
import { EpicNote } from "../Note/Epic/EpicNote.tsx";

export function StoryMap() {
  const {
    epics,
    selected,
    isFocused, setIsFocused,
  } = useStoryMap();

  useEffect(function toggleFocus() {
    function handleFocusIn(event) { setIsFocused((event.target.className || '').split(' ').includes('note')); }
    function handleFocusOut() { setIsFocused(false); }

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    }
  });

  const displayArrowKeys = useMemo(() => !isMobileOrTablet(), []);
  const noSelectionFound = Object.keys(selected).length === 0;

  return (
    <>
      <div className="w-full min-w-max">

        <div className="flex p-2">
          {epics.map((e, index) => (
            <EpicNote
              key={e.id}
              epic={e}
              focusable={index === 0 && noSelectionFound}
            />
          ))}
        </div>
      </div >

      {displayArrowKeys && isFocused ? <ArrowKeys /> : null}
    </>
  )
}