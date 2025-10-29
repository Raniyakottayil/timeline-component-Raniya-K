
import {type ViewMode } from '../types/timeline.types';
import { TIMELINE_CONSTANTS } from '../constants/timeline.constants';
import { getWeekNumber } from './date.utils';

interface TimeScale {
  date: Date;
  label: string;
}

/**
 * Calculate pixel position from date
 */
export const calculatePosition = (
  date: Date,
  startDate: Date,
  pixelsPerDay: number
): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = (date.getTime() - startDate.getTime()) / msPerDay;
  return Math.round(daysSinceStart * pixelsPerDay);
};

/**
 * Calculate duration in pixels
 */
export const calculateDuration = (
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const durationDays = (endDate.getTime() - startDate.getTime()) / msPerDay;
  return Math.max(Math.round(durationDays * pixelsPerDay), 20); // Minimum 20px width
};

/**
 * Calculate date from pixel position
 */
export const calculateDateFromPosition = (
  position: number,
  startDate: Date,
  pixelsPerDay: number
): Date => {
  const days = Math.round(position / pixelsPerDay);
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get pixels per day for view mode
 */
export const getPixelsPerDay = (viewMode: ViewMode): number => {
  switch (viewMode) {
    case 'day':
      return TIMELINE_CONSTANTS.DAY_WIDTH;
    case 'week':
      return TIMELINE_CONSTANTS.WEEK_WIDTH / 7;
    case 'month':
      return TIMELINE_CONSTANTS.MONTH_WIDTH / 30;
    default:
      return TIMELINE_CONSTANTS.DAY_WIDTH;
  }
};

/**
 * Generate time scale labels
 */
export const generateTimeScale = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
): TimeScale[] => {
  const scale: TimeScale[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    if (viewMode === 'day') {
      scale.push({
        date: new Date(current),
        label: current.toLocaleDateString('en-US', TIMELINE_CONSTANTS.DATE_FORMATS.DAY),
      });
      current.setDate(current.getDate() + 1);
    } else if (viewMode === 'week') {
      scale.push({
        date: new Date(current),
        label: `Week ${getWeekNumber(current)}`,
      });
      current.setDate(current.getDate() + 7);
    } else {
      scale.push({
        date: new Date(current),
        label: current.toLocaleDateString('en-US', TIMELINE_CONSTANTS.DATE_FORMATS.MONTH),
      });
      current.setMonth(current.getMonth() + 1);
    }
  }

  return scale;
};

/**
 * Calculate total timeline width
 */
export const calculateTimelineWidth = (
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): number => {
  return calculateDuration(startDate, endDate, pixelsPerDay);
};