import { useEffect, useMemo } from "react";
import { useStoryMap } from "../../hooks/useStoryMap/useStoryMap";
import { isMobileOrTablet } from "../../utils/utils";
import { ArrowKeys } from "../ArrowKeys/ArrowKeys";
import { EpicSwimlane } from "./Swimlane/EpicSwimlane";

export function StoryMap() {
  const {
    epics,
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

  return (
    <>
      <div className="w-full min-w-max">
        <div className="flex p-2">
          <EpicSwimlane epics={epics} />
        </div>
      </div >

      {displayArrowKeys && isFocused ? <ArrowKeys /> : null}
    </>
  )
}