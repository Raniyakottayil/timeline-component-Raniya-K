// src/components/Timeline/TimelineView.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimelineView } from './TimelineView';
import {type TimelineRow, type TimelineTask } from './TimelineView.types';

const meta: Meta<typeof TimelineView> = {
  title: 'Components/TimelineView',
  component: TimelineView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimelineView>;

// Sample data
const sampleRows: TimelineRow[] = [
  { id: 'row-1', label: 'Frontend Team', tasks: ['task-1', 'task-2'] },
  { id: 'row-2', label: 'Backend Team', tasks: ['task-3'] },
  { id: 'row-3', label: 'Design Team', tasks: ['task-4'] },
];

const sampleTasks: Record<string, TimelineTask> = {
  'task-1': {
    id: 'task-1',
    title: 'UI Component Development',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 15),
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
    startDate: new Date(2024, 0, 16),
    endDate: new Date(2024, 0, 25),
    progress: 0,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: ['task-1', 'task-3'],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-3': {
    id: 'task-3',
    title: 'API Development',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 14),
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
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 0, 12),
    progress: 100,
    assignee: 'Design Team',
    rowId: 'row-3',
    dependencies: [],
    color: '#f59e0b',
    isMilestone: false,
  },
};

// Interactive wrapper
const InteractiveWrapper = ({ initialRows, initialTasks, ...props }: any) => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleTaskUpdate = (taskId: string, updates: Partial<TimelineTask>) => {
    setTasks((prev: Record<string, TimelineTask>) => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
  };

  const handleTaskMove = (taskId: string, newRowId: string, newStartDate: Date) => {
    const task = tasks[taskId];
    if (!task) return;

    const duration = task.endDate.getTime() - task.startDate.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);

    setTasks((prev: Record<string, TimelineTask>) => ({
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
    <div style={{ height: '100vh' }}>
      <TimelineView
        rows={initialRows}
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskMove={handleTaskMove}
        {...props}
      />
    </div>
  );
};

// Story 1: Default
export const Default: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={sampleRows}
      initialTasks={sampleTasks}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 2, 31)}
      viewMode="week"
    />
  ),
};

// Story 2: Empty State
export const EmptyState: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={[]}
      initialTasks={{}}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 2, 31)}
      viewMode="week"
    />
  ),
};

// Story 3: With Dependencies
export const WithDependencies: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={sampleRows}
      initialTasks={sampleTasks}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 2, 31)}
      viewMode="week"
    />
  ),
};

// Story 4: Day View
export const DayView: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={sampleRows}
      initialTasks={sampleTasks}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 0, 31)}
      viewMode="day"
    />
  ),
};

// Story 5: Month View
export const MonthView: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={sampleRows}
      initialTasks={sampleTasks}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 11, 31)}
      viewMode="month"
    />
  ),
};

// Story 6: Large Dataset
const largeTasks: Record<string, TimelineTask> = {};
const largeRows: TimelineRow[] = [];

for (let i = 0; i < 10; i++) {
  largeRows.push({
    id: `row-${i}`,
    label: `Team ${i + 1}`,
    tasks: [],
  });
}

for (let i = 0; i < 50; i++) {
  const rowIndex = i % 10;
  const taskId = `task-${i}`;
  const startDay = Math.floor(i / 2) * 3;
  
  largeTasks[taskId] = {
    id: taskId,
    title: `Task ${i + 1}`,
    startDate: new Date(2024, 0, 1 + startDay),
    endDate: new Date(2024, 0, 5 + startDay),
    progress: Math.floor(Math.random() * 100),
    assignee: `Team ${rowIndex + 1}`,
    rowId: `row-${rowIndex}`,
    dependencies: [],
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    isMilestone: false,
  };
  
  largeRows[rowIndex].tasks.push(taskId);
}

export const LargeDataset: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={largeRows}
      initialTasks={largeTasks}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 2, 31)}
      viewMode="week"
    />
  ),
};

// Story 7: With Milestones
const tasksWithMilestones: Record<string, TimelineTask> = {
  ...sampleTasks,
  'milestone-1': {
    id: 'milestone-1',
    title: 'Release v1.0',
    startDate: new Date(2024, 0, 25),
    endDate: new Date(2024, 0, 25),
    progress: 0,
    assignee: 'Project Manager',
    rowId: 'row-1',
    dependencies: ['task-2'],
    color: '#ef4444',
    isMilestone: true,
  },
};

export const WithMilestones: Story = {
  render: () => (
    <InteractiveWrapper
      initialRows={sampleRows}
      initialTasks={tasksWithMilestones}
      startDate={new Date(2024, 0, 1)}
      endDate={new Date(2024, 2, 31)}
      viewMode="week"
    />
  ),
};

// Story 8: Mobile View
export const MobileView: Story = {
  render: () => (
    <div style={{ width: '375px', height: '667px' }}>
      <InteractiveWrapper
        initialRows={sampleRows}
        initialTasks={sampleTasks}
        startDate={new Date(2024, 0, 1)}
        endDate={new Date(2024, 2, 31)}
        viewMode="week"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};