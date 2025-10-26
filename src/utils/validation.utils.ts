
import { TimelineTask } from '../types/timeline.types';

/**
 * Validate task data
 */
export const validateTask = (task: Partial<TimelineTask>): string[] => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (!task.startDate) {
    errors.push('Start date is required');
  }

  if (!task.endDate) {
    errors.push('End date is required');
  }

  if (task.startDate && task.endDate && task.startDate > task.endDate) {
    errors.push('Start date must be before end date');
  }

  if (task.progress !== undefined && (task.progress < 0 || task.progress > 100)) {
    errors.push('Progress must be between 0 and 100');
  }

  if (!task.rowId) {
    errors.push('Row ID is required');
  }

  return errors;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

/**
 * Clamp progress value
 */
export const clampProgress = (progress: number): number => {
  return Math.max(0, Math.min(100, progress));
};