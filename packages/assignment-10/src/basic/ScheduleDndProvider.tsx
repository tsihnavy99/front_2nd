import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { memo, PropsWithChildren, useCallback, useMemo } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { Schedule } from "./types.ts";
import { useTableContext } from "./TableProvider.tsx";

export function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;


    return ({
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    })
  };
}

const modifiers = [createSnapModifier()]

const ScheduleDndProvider = memo(function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { schedules, update } = useTableContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback((event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = active.id.split(':');
    const schedule = schedules[index];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number])
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    const updateSchedules = () => {
      const updated: Schedule[] = [];

      schedules.forEach((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          updated.push(targetSchedule);
        } else {
          const sc = {...targetSchedule,
            day: DAY_LABELS[nowDayIndex + moveDayIndex],
            range: targetSchedule.range.map(time => time + moveTimeIndex),
          }
          updated.push(sc)
        }
      })
  
      update(tableId, updated)
    }
    
    updateSchedules();
  }, [schedules, update]);

  const value = useMemo(
    () => ({
      sensors,
      handleDragEnd,
    }),
    [sensors, handleDragEnd]
  );

  return (
    <DndContext sensors={value.sensors} onDragEnd={value.handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
})
export default ScheduleDndProvider;
