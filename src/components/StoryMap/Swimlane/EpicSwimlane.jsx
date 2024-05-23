import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { NOTE_TYPE } from "../../../const.js";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap.js";
import { Draggable } from "../../DragAndDrop/Draggable.jsx";
import { Droppable } from "../../DragAndDrop/Droppable.jsx";
import { EpicNote } from "../../Note/Epic/EpicNote.tsx";

export function EpicSwimlane({ epics }) {

  const { selected, swapEpics } = useStoryMap();

  const noSelectionFound = Object.keys(selected).length === 0;

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.ids) {
      swapEpics(active.id, over.id);
    }
  }

  return (
    <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd}>
      {epics.map((e, index) => (
        <Droppable key={e.id} id={e.id} type={NOTE_TYPE.EPIC}>
          <Draggable id={e.id} type={NOTE_TYPE.EPIC}>
            <EpicNote epic={e} focusable={index === 0 && noSelectionFound} showFeatures={false} />
          </Draggable>
        </Droppable>

      ))}
    </DndContext>
  )

}