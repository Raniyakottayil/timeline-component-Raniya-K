// src/App.tsx

import { useState } from 'react';
import { TimelineView } from './components/Timeline/TimelineView';
import { type TimelineRow, type TimelineTask } from './components/Timeline/TimelineView.types';

// Sample data
const initialRows: TimelineRow[] = [
  { id: 'row-1', label: 'Frontend Team', tasks: ['task-1', 'task-2', 'task-5'] },
  { id: 'row-2', label: 'Backend Team', tasks: ['task-3', 'task-6'] },
  { id: 'row-3', label: 'Design Team', tasks: ['task-4'] },
  { id: 'row-4', label: 'DevOps Team', tasks: ['task-7'] },
];

const initialTasks: Record<string, TimelineTask> = {
  'task-1': {
    id: 'task-1',
    title: 'UI Component Development',
    startDate: new Date(2024, 9, 1),
    endDate: new Date(2024, 9, 15),
    progress: 60,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: [],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-2': {
    id: 'task-2',
    title: 'Integration Testing',
    startDate: new Date(2024, 9, 16),
    endDate: new Date(2024, 9, 28),
    progress: 20,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: ['task-1', 'task-3'],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-3': {
    id: 'task-3',
    title: 'API Development',
    startDate: new Date(2024, 9, 1),
    endDate: new Date(2024, 9, 14),
    progress: 80,
    assignee: 'Backend Team',
    rowId: 'row-2',
    dependencies: [],
    color: '#10b981',
    isMilestone: false,
  },
  'task-4': {
    id: 'task-4',
    title: 'Design System Update',
    startDate: new Date(2024, 9, 5),
    endDate: new Date(2024, 9, 12),
    progress: 100,
    assignee: 'Design Team',
    rowId: 'row-3',
    dependencies: [],
    color: '#f59e0b',
    isMilestone: false,
  },
  'task-5': {
    id: 'task-5',
    title: 'Code Review & Refactoring',
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 10, 7),
    progress: 0,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: ['task-2'],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-6': {
    id: 'task-6',
    title: 'Database Optimization',
    startDate: new Date(2024, 9, 20),
    endDate: new Date(2024, 10, 5),
    progress: 40,
    assignee: 'Backend Team',
    rowId: 'row-2',
    dependencies: ['task-3'],
    color: '#10b981',
    isMilestone: false,
  },
  'task-7': {
    id: 'task-7',
    title: 'CI/CD Pipeline Setup',
    startDate: new Date(2024, 9, 10),
    endDate: new Date(2024, 9, 20),
    progress: 90,
    assignee: 'DevOps Team',
    rowId: 'row-4',
    dependencies: [],
    color: '#8b5cf6',
    isMilestone: false,
  },
  'milestone-1': {
    id: 'milestone-1',
    title: 'Release v1.0',
    startDate: new Date(2024, 10, 10),
    endDate: new Date(2024, 10, 10),
    progress: 0,
    assignee: 'Project Manager',
    rowId: 'row-1',
    dependencies: ['task-5'],
    color: '#ef4444',
    isMilestone: true,
  },
};

function App() {
  const [tasks, setTasks] = useState<Record<string, TimelineTask>>(initialTasks);
  const [rows] = useState<TimelineRow[]>(initialRows);

  const handleTaskUpdate = (taskId: string, updates: Partial<TimelineTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
  };

  const handleTaskMove = (taskId: string, newRowId: string, newStartDate: Date) => {
    const task = tasks[taskId];
    if (!task) return;

    // Calculate duration and new end date
    const duration = task.endDate.getTime() - task.startDate.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);

    // Update task with new position
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        rowId: newRowId,
        startDate: newStartDate,
        endDate: newEndDate,
      },
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <TimelineView
        rows={rows}
        tasks={tasks}
        startDate={new Date(2024, 9, 1)}
        endDate={new Date(2024, 11, 31)}
        viewMode="week"
        onTaskUpdate={handleTaskUpdate}
        onTaskMove={handleTaskMove}
      />
    </div>
  );
}

export default App;