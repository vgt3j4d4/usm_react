import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { NOTE_TYPE } from "../../../const.js";
import { useStoryMap } from "../../../hooks/useStoryMap/useStoryMap.js";
import { Draggable } from "../../DragAndDrop/Draggable.jsx";
import { Droppable } from "../../DragAndDrop/Droppable.jsx";
import { FeatureNote } from "../../Note/Feature/FeatureNote.tsx";

export function FeatureSwimlane({ features }) {

  const { swapFeatures } = useStoryMap();

  function handleDragEnd(event) {
    const { active, over } = event;

    let id;
    if (over && active) {
      const [epicId1, featureId1] = active.id.split('-');
      const [epicId2, featureId2] = over.id.split('-');
      if (featureId1 !== featureId2) {
        swapFeatures(epicId1, featureId1, epicId2, featureId2);
      }
    }
  }

  return (
    <div>
      <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd}>
        {features.map(f => (
          <Droppable key={f.id} id={`${f.epicId}-${f.id}`} type={NOTE_TYPE.FEATURE}>
            <Draggable id={`${f.epicId}-${f.id}`} type={NOTE_TYPE.FEATURE}>
              <FeatureNote feature={f} showStories={false} />
            </Draggable>
          </Droppable>
        ))}
      </DndContext>
    </div>
  )

}