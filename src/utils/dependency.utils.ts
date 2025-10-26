// src/utils/dependency.utils.ts

import { type TimelineTask,type DependencyLineData, type TaskPosition } from '../types/timeline.types';

/**
 * Calculate dependency line coordinates
 */
export const calculateDependencyLine = (
  fromTask: TimelineTask,
  toTask: TimelineTask,
  fromPosition: TaskPosition,
  toPosition: TaskPosition
): DependencyLineData => {
  // Start from end of predecessor task
  const x1 = fromPosition.left + fromPosition.width;
  const y1 = fromPosition.top + fromPosition.height / 2;

  // End at start of dependent task
  const x2 = toPosition.left;
  const y2 = toPosition.top + toPosition.height / 2;

  return {
    x1,
    y1,
    x2,
    y2,
    fromTaskId: fromTask.id,
    toTaskId: toTask.id,
  };
};

/**
 * Get all dependencies for a task
 */
export const getTaskDependencies = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  const task = tasks[taskId];
  return task?.dependencies || [];
};

/**
 * Get all tasks that depend on this task
 */
export const getDependentTasks = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  return Object.values(tasks)
    .filter(task => task.dependencies?.includes(taskId))
    .map(task => task.id);
};

/**
 * Check if there are circular dependencies
 */
export const hasCircularDependency = (
  taskId: string,
  dependencyId: string,
  tasks: Record<string, TimelineTask>,
  visited = new Set<string>()
): boolean => {
  if (taskId === dependencyId) return true;
  if (visited.has(dependencyId)) return false;

  visited.add(dependencyId);
  
  const dependentTasks = getDependentTasks(dependencyId, tasks);
  
  return dependentTasks.some(depId => 
    hasCircularDependency(taskId, depId, tasks, visited)
  );
};