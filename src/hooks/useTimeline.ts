
import { useState, useCallback, useMemo } from 'react';
import { type ViewMode } from '../types/timeline.types';
import { getPixelsPerDay } from '../utils/position.utils';
import { addMonths } from '../utils/date.utils';

interface TimelineState {
  viewMode: ViewMode;
  startDate: Date;
  endDate: Date;
  pixelsPerDay: number;
}

export const useTimeline = (initialDate: Date = new Date()) => {
  const [state, setState] = useState<TimelineState>(() => {
    const start = new Date(initialDate.getFullYear(), initialDate.getMonth() - 1, 1);
    const end = addMonths(start, 4);
    
    return {
      viewMode: 'week',
      startDate: start,
      endDate: end,
      pixelsPerDay: getPixelsPerDay('week'),
    };
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({
      ...prev,
      viewMode: mode,
      pixelsPerDay: getPixelsPerDay(mode),
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setState(prev => {
      if (prev.viewMode === 'month') {
        return { ...prev, viewMode: 'week', pixelsPerDay: getPixelsPerDay('week') };
      }
      if (prev.viewMode === 'week') {
        return { ...prev, viewMode: 'day', pixelsPerDay: getPixelsPerDay('day') };
      }
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => {
      if (prev.viewMode === 'day') {
        return { ...prev, viewMode: 'week', pixelsPerDay: getPixelsPerDay('week') };
      }
      if (prev.viewMode === 'week') {
        return { ...prev, viewMode: 'month', pixelsPerDay: getPixelsPerDay('month') };
      }
      return prev;
    });
  }, []);

  const scrollToToday = useCallback(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = addMonths(start, 4);
    
    setState(prev => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
  }, []);

  const canZoomIn = useMemo(() => state.viewMode !== 'day', [state.viewMode]);
  const canZoomOut = useMemo(() => state.viewMode !== 'month', [state.viewMode]);

  return {
    ...state,
    setViewMode,
    zoomIn,
    zoomOut,
    scrollToToday,
    canZoomIn,
    canZoomOut,
  };
};