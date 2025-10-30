// src/components/Timeline/TimelineRow.tsx

import React, { memo, useMemo } from 'react';
import { type TimelineRow as TimelineRowType, type TimelineTask,type TaskPosition } from '../../types/timeline.types';
import { calculatePosition, calculateDuration } from '../../utils/position.utils';
import { TaskBar } from './TaskBar';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { getInitials } from '../../utils/formatting.utils';

interface TimelineRowProps {
  row: TimelineRowType;
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  pixelsPerDay: number;
  rowIndex: number;
  onTaskClick: (task: TimelineTask) => void;
  onDragStart: (e: React.MouseEvent, taskId: string, left: number, rowId: string) => void;
  onResizeStart: (e: React.MouseEvent, taskId: string, edge: 'left' | 'right', left: number, width: number) => void;
  draggingTaskId?: string | null;
  resizingTaskId?: string | null;
}

export const TimelineRow: React.FC<TimelineRowProps> = memo(({
  row,
  tasks,
  startDate,
  pixelsPerDay,
  onTaskClick,
  onDragStart,
  onResizeStart,
  draggingTaskId,
  resizingTaskId,
}) => {
  const rowTasks = useMemo(
    () => row.tasks.map(taskId => tasks[taskId]).filter(Boolean),
    [row.tasks, tasks]
  );

  const taskPositions = useMemo(() => {
    const positions = new Map<string, TaskPosition>();
    
    rowTasks.forEach(task => {
      const left = calculatePosition(task.startDate, startDate, pixelsPerDay);
      const width = calculateDuration(task.startDate, task.endDate, pixelsPerDay);
      const top = TIMELINE_CONSTANTS.ROW_PADDING;
      const height = task.isMilestone 
        ? TIMELINE_CONSTANTS.MILESTONE_HEIGHT 
        : TIMELINE_CONSTANTS.TASK_HEIGHT;

      positions.set(task.id, { left, width, top, height });
    });

    return positions;
  }, [rowTasks, startDate, pixelsPerDay]);

  return (
    <div
      className="relative"
      style={{ height: `${TIMELINE_CONSTANTS.ROW_HEIGHT}px` }}
      role="region"
      aria-label={`${row.label} timeline. ${row.tasks.length} tasks.`}
    >
      {/* Row label (left panel) */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-white border-r border-neutral-200"
        style={{ width: `${TIMELINE_CONSTANTS.LEFT_PANEL_WIDTH}px` }}
      >
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={row.label}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium">
              {getInitials(row.label)}
            </div>
          )}
          <span className="text-sm font-medium text-neutral-900 truncate">
            {row.label}
          </span>
        </div>
      </div>

      {/* Task bars */}
      <div className="relative" style={{ marginLeft: `${TIMELINE_CONSTANTS.LEFT_PANEL_WIDTH}px` }}>
        {rowTasks.map(task => {
          const position = taskPositions.get(task.id);
          if (!position) return null;

          return (
            <TaskBar
              key={task.id}
              task={task}
              position={position}
              onDragStart={onDragStart}
              onResizeStart={onResizeStart}
              onClick={onTaskClick}
              isDragging={draggingTaskId === task.id}
              isResizing={resizingTaskId === task.id}
            />
          );
        })}
      </div>
    </div>
  );
});