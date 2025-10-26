// src/components/Timeline/TimelineView.types.ts

export interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  assignee?: string;
  rowId: string;
  dependencies?: string[];
  color?: string;
  isMilestone?: boolean;
}

export interface TimelineRow {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[];
}

export interface TimelineViewProps {
  rows: TimelineRow[];
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  endDate: Date;
  viewMode: 'day' | 'week' | 'month';
  onTaskUpdate: (taskId: string, updates: Partial<TimelineTask>) => void;
  onTaskMove: (taskId: string, newRowId: string, newStartDate: Date) => void;
}

export interface TaskPosition {
  left: number;
  width: number;
  top: number;
  height: number;
}

export interface DependencyLineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromTaskId: string;
  toTaskId: string;
}

export type ViewMode = 'day' | 'week' | 'month';