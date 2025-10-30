
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {type TimelineViewProps,type TimelineTask, type TaskPosition } from './TimelineView.types';
import { TimelineGrid } from './TimelineGrid';
import { TimelineRow } from './TimelineRow';
import { DependencyLine } from './DependencyLine';
import { TaskDetailSidebar } from './TaskDetailSidebar';
import { Button } from '../primitives/Button';
import { useTimeline } from '../../hooks/useTimeline';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useScrollSync } from '../../hooks/useScrollSync';
import { useZoom } from '../../hooks/useZoom';
import { generateTimeScale, calculatePosition, calculateDuration } from '../../utils/position.utils';
import { calculateDependencyLine } from '../../utils/dependency.utils';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';

export const TimelineView: React.FC<TimelineViewProps> = ({
  rows,
  tasks,
  startDate: initialStartDate,
  onTaskUpdate,
  onTaskMove,
}) => {
  const {
    viewMode,
    startDate,
    endDate,
    pixelsPerDay,
    setViewMode,
    zoomIn,
    zoomOut,
    scrollToToday,
    canZoomIn,
    canZoomOut,
  } = useTimeline(initialStartDate);

  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { scrollContainerRef, headerRef } = useScrollSync();

  const handleTaskClick = useCallback((task: TimelineTask) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  }, []);

  const handleTaskUpdate = useCallback(
    (taskId: string, updates: Partial<TimelineTask>) => {
      onTaskUpdate(taskId, updates);
      setSelectedTask(prev => prev?.id === taskId ? { ...prev, ...updates } as TimelineTask : prev);
    },
    [onTaskUpdate]
  );

  const handleTaskMoveComplete = useCallback(
    (taskId: string, newRowId: string, newStartDate: Date) => {
      const task = tasks[taskId];
      if (!task) return;

      const duration = task.endDate.getTime() - task.startDate.getTime();
      const newEndDate = new Date(newStartDate.getTime() + duration);

      onTaskMove(taskId, newRowId, newStartDate);
      onTaskUpdate(taskId, { startDate: newStartDate, endDate: newEndDate, rowId: newRowId });
    },
    [tasks, onTaskMove, onTaskUpdate]
  );

  const handleTaskResize = useCallback(
    (taskId: string, newStartDate: Date, newEndDate: Date) => {
      onTaskUpdate(taskId, { startDate: newStartDate, endDate: newEndDate });
    },
    [onTaskUpdate]
  );

  const {
    dragState,
    resizeState,
    handleDragStart,
    handleDragEnd,
    handleResizeStart,
    handleResizeEnd,
  } = useDragAndDrop({
    onTaskMove: handleTaskMoveComplete,
    onTaskResize: handleTaskResize,
    pixelsPerDay,
    startDate,
    rowHeight: TIMELINE_CONSTANTS.ROW_HEIGHT,
  });

  // Global mouse handlers for drag and resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault();
      }
      if (resizeState.isResizing) {
        e.preventDefault();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragState.isDragging) {
        handleDragEnd(e, rows);
      }
      if (resizeState.isResizing && resizeState.taskId) {
        const task = tasks[resizeState.taskId];
        if (task) {
          handleResizeEnd(e, task.startDate, task.endDate);
        }
      }
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, handleDragEnd, handleResizeEnd, rows, tasks]);

  useZoom({ onZoomIn: zoomIn, onZoomOut: zoomOut, canZoomIn, canZoomOut });

  const timeScale = useMemo(
    () => generateTimeScale(startDate, endDate, viewMode),
    [startDate, endDate, viewMode]
  );

  const columnWidth = useMemo(() => {
    if (viewMode === 'day') return TIMELINE_CONSTANTS.DAY_WIDTH;
    if (viewMode === 'week') return TIMELINE_CONSTANTS.WEEK_WIDTH;
    return TIMELINE_CONSTANTS.MONTH_WIDTH;
  }, [viewMode]);

  // Calculate dependency lines
  const dependencyLines = useMemo(() => {
    const lines = [];
    
    for (const task of Object.values(tasks)) {
      if (!task.dependencies || task.dependencies.length === 0) continue;

      for (const depId of task.dependencies) {
        const depTask = tasks[depId];
        if (!depTask) continue;

        const fromLeft = calculatePosition(depTask.startDate, startDate, pixelsPerDay);
        const fromWidth = calculateDuration(depTask.startDate, depTask.endDate, pixelsPerDay);
        const fromRowIndex = rows.findIndex(r => r.id === depTask.rowId);
        
        const toLeft = calculatePosition(task.startDate, startDate, pixelsPerDay);
        const toWidth = calculateDuration(task.startDate, task.endDate, pixelsPerDay);
        const toRowIndex = rows.findIndex(r => r.id === task.rowId);

        if (fromRowIndex === -1 || toRowIndex === -1) continue;

        const fromPosition: TaskPosition = {
          left: fromLeft,
          width: fromWidth,
          top: fromRowIndex * TIMELINE_CONSTANTS.ROW_HEIGHT + TIMELINE_CONSTANTS.ROW_PADDING + TIMELINE_CONSTANTS.TASK_HEIGHT / 2,
          height: TIMELINE_CONSTANTS.TASK_HEIGHT,
        };

        const toPosition: TaskPosition = {
          left: toLeft,
          width: toWidth,
          top: toRowIndex * TIMELINE_CONSTANTS.ROW_HEIGHT + TIMELINE_CONSTANTS.ROW_PADDING + TIMELINE_CONSTANTS.TASK_HEIGHT / 2,
          height: TIMELINE_CONSTANTS.TASK_HEIGHT,
        };

        lines.push(calculateDependencyLine(depTask, task, fromPosition, toPosition));
      }
    }

    return lines;
  }, [tasks, rows, startDate, pixelsPerDay]);

  const isEmpty = rows.length === 0 || Object.keys(tasks).length === 0;

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'day' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'week' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'month' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={scrollToToday}>
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={zoomOut}
              disabled={!canZoomOut}
              aria-label="Zoom out"
            >
              -
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={zoomIn}
              disabled={!canZoomIn}
              aria-label="Zoom in"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-neutral-900">No tasks</h3>
            <p className="mt-1 text-sm text-neutral-500">Get started by adding your first task.</p>
          </div>
        </div>
      )}

      {/* Timeline Content */}
      {!isEmpty && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Time scale header */}
          <div
            ref={headerRef}
            className="flex-shrink-0 overflow-hidden bg-white border-b border-neutral-200"
            style={{ height: '48px' }}
          >
            <div className="flex">
              <div
                className="flex-shrink-0 border-r border-neutral-200"
                style={{ width: `${TIMELINE_CONSTANTS.LEFT_PANEL_WIDTH}px` }}
              />
              <div className="flex">
                {timeScale.map((scale, index) => (
                  <div
                    key={`header-${index}`}
                    className="flex items-center justify-center text-xs font-medium text-neutral-600 border-r border-neutral-200"
                    style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}
                  >
                    {scale.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable timeline */}
          <div ref={scrollContainerRef} className="flex-1 overflow-auto relative">
            <div className="relative">
              {/* Grid background */}
              <div style={{ marginLeft: `${TIMELINE_CONSTANTS.LEFT_PANEL_WIDTH}px` }}>
                <TimelineGrid
                  startDate={startDate}
                  endDate={endDate}
                  viewMode={viewMode}
                  pixelsPerDay={pixelsPerDay}
                  rowCount={rows.length}
                />
              </div>

              {/* Dependency lines */}
              {dependencyLines.length > 0 && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: TIMELINE_CONSTANTS.Z_INDEX.DEPENDENCY,
                    marginLeft: `${TIMELINE_CONSTANTS.LEFT_PANEL_WIDTH}px`,
                  }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill={TIMELINE_CONSTANTS.DEPENDENCY_COLOR} />
                    </marker>
                  </defs>
                  {dependencyLines.map((line, index) => (
                    <DependencyLine key={`dep-${index}`} line={line} />
                  ))}
                </svg>
              )}

              {/* Rows */}
              <div className="absolute top-0 left-0 right-0">
                {rows.map((row, index) => (
                  <TimelineRow
                    key={row.id}
                    row={row}
                    tasks={tasks}
                    startDate={startDate}
                    pixelsPerDay={pixelsPerDay}
                    rowIndex={index}
                    onTaskClick={handleTaskClick}
                    onDragStart={handleDragStart}
                    onResizeStart={handleResizeStart}
                    draggingTaskId={dragState.taskId}
                    resizingTaskId={resizeState.taskId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Sidebar */}
       <TaskDetailSidebar
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onUpdate={handleTaskUpdate}
        //  onDelete={handleDelete} 
        allTasks={tasks}
      />
    </div>
  );
};