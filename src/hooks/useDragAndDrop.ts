
import { useState, useCallback, useRef } from 'react';
import { type DragState, type ResizeState } from '../types/timeline.types';
import { calculateDateFromPosition } from '../utils/position.utils';
import { TIMELINE_CONSTANTS } from '../constants/timeline.constants';

interface UseDragAndDropProps {
  onTaskMove?: (taskId: string, newRowId: string, newStartDate: Date) => void;
  onTaskResize?: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  pixelsPerDay: number;
  startDate: Date;
  rowHeight: number;
}

export const useDragAndDrop = ({
  onTaskMove,
  onTaskResize,
  pixelsPerDay,
  startDate,
  rowHeight,
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    taskId: null,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialRowId: null,
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    taskId: null,
    edge: null,
    startX: 0,
    initialWidth: 0,
    initialLeft: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent, taskId: string, left: number, rowId: string) => {
      e.stopPropagation();
      
      setDragState({
        isDragging: true,
        taskId,
        startX: e.clientX,
        startY: e.clientY,
        initialLeft: left,
        initialRowId: rowId,
      });
    },
    []
  );

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.taskId) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      // Calculate new position
      const newLeft = dragState.initialLeft + deltaX;
      const newRowIndex = Math.floor(deltaY / rowHeight);

      return { newLeft, newRowIndex, deltaX, deltaY };
    },
    [dragState, rowHeight]
  );

  const handleDragEnd = useCallback(
    (e: MouseEvent, rows: Array<{ id: string }>) => {
      if (!dragState.isDragging || !dragState.taskId || !dragState.initialRowId) {
        setDragState({
          isDragging: false,
          taskId: null,
          startX: 0,
          startY: 0,
          initialLeft: 0,
          initialRowId: null,
        });
        return;
      }

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      // Calculate new date
      const newLeft = dragState.initialLeft + deltaX;
      const newDate = calculateDateFromPosition(newLeft, startDate, pixelsPerDay);

      // Calculate new row
      const currentRowIndex = rows.findIndex(r => r.id === dragState.initialRowId);
      const rowDelta = Math.round(deltaY / rowHeight);
      const newRowIndex = Math.max(0, Math.min(rows.length - 1, currentRowIndex + rowDelta));
      const newRowId = rows[newRowIndex].id;

      if (onTaskMove && (newRowId !== dragState.initialRowId || Math.abs(deltaX) > TIMELINE_CONSTANTS.DRAG_THRESHOLD)) {
        onTaskMove(dragState.taskId, newRowId, newDate);
      }

      setDragState({
        isDragging: false,
        taskId: null,
        startX: 0,
        startY: 0,
        initialLeft: 0,
        initialRowId: null,
      });
    },
    [dragState, onTaskMove, pixelsPerDay, startDate, rowHeight]
  );

  // Resize handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, taskId: string, edge: 'left' | 'right', left: number, width: number) => {
      e.stopPropagation();
      
      setResizeState({
        isResizing: true,
        taskId,
        edge,
        startX: e.clientX,
        initialWidth: width,
        initialLeft: left,
      });
    },
    []
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeState.isResizing || !resizeState.taskId) return null;

      const deltaX = e.clientX - resizeState.startX;

      if (resizeState.edge === 'left') {
        const newLeft = resizeState.initialLeft + deltaX;
        const newWidth = resizeState.initialWidth - deltaX;
        return { newLeft, newWidth };
      } else {
        const newWidth = resizeState.initialWidth + deltaX;
        return { newLeft: resizeState.initialLeft, newWidth };
      }
    },
    [resizeState]
  );

  const handleResizeEnd = useCallback(
    (e: MouseEvent, taskStartDate: Date, taskEndDate: Date) => {
      if (!resizeState.isResizing || !resizeState.taskId) {
        setResizeState({
          isResizing: false,
          taskId: null,
          edge: null,
          startX: 0,
          initialWidth: 0,
          initialLeft: 0,
        });
        return;
      }

      const deltaX = e.clientX - resizeState.startX;

      if (resizeState.edge === 'left') {
        const newLeft = resizeState.initialLeft + deltaX;
        const newStartDate = calculateDateFromPosition(newLeft, startDate, pixelsPerDay);
        
        if (onTaskResize && newStartDate < taskEndDate) {
          onTaskResize(resizeState.taskId, newStartDate, taskEndDate);
        }
      } else {
        const newWidth = resizeState.initialWidth + deltaX;
        const newEndDate = calculateDateFromPosition(
          resizeState.initialLeft + newWidth,
          startDate,
          pixelsPerDay
        );
        
        if (onTaskResize && newEndDate > taskStartDate) {
          onTaskResize(resizeState.taskId, taskStartDate, newEndDate);
        }
      }

      setResizeState({
        isResizing: false,
        taskId: null,
        edge: null,
        startX: 0,
        initialWidth: 0,
        initialLeft: 0,
      });
    },
    [resizeState, onTaskResize, pixelsPerDay, startDate]
  );

  return {
    dragState,
    resizeState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    containerRef,
  };
};