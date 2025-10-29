

import React, { memo, useMemo } from 'react';
import {type ViewMode } from '../../types/timeline.types';
import { generateTimeScale, calculateTimelineWidth } from '../../utils/position.utils';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { isSameDay } from '../../utils/date.utils';

interface TimelineGridProps {
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
  pixelsPerDay: number;
  rowCount: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = memo(({
  startDate,
  endDate,
  viewMode,
  pixelsPerDay,
  rowCount,
}) => {
  const timeScale = useMemo(
    () => generateTimeScale(startDate, endDate, viewMode),
    [startDate, endDate, viewMode]
  );

  const totalWidth = useMemo(
    () => calculateTimelineWidth(startDate, endDate, pixelsPerDay),
    [startDate, endDate, pixelsPerDay]
  );

  const totalHeight = rowCount * TIMELINE_CONSTANTS.ROW_HEIGHT;

  const columnWidth = useMemo(() => {
    if (viewMode === 'day') return TIMELINE_CONSTANTS.DAY_WIDTH;
    if (viewMode === 'week') return TIMELINE_CONSTANTS.WEEK_WIDTH;
    return TIMELINE_CONSTANTS.MONTH_WIDTH;
  }, [viewMode]);

  const today = new Date();
  const todayPosition = useMemo(() => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceStart = (today.getTime() - startDate.getTime()) / msPerDay;
    return daysSinceStart * pixelsPerDay;
  }, [today, startDate, pixelsPerDay]);

  const isTodayVisible = todayPosition >= 0 && todayPosition <= totalWidth;

  return (
    <div className="relative" style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}>
      {/* Vertical grid lines */}
      {timeScale.map((scale, index) => {
        const x = index * columnWidth;
        const isToday = isSameDay(scale.date, today);
        
        return (
          <div
            key={`grid-${index}`}
            className="absolute top-0 bottom-0 border-l"
            style={{
              left: `${x}px`,
              borderColor: isToday ? TIMELINE_CONSTANTS.TODAY_LINE_COLOR : TIMELINE_CONSTANTS.GRID_LINE_COLOR,
              borderWidth: isToday ? '2px' : '1px',
              zIndex: TIMELINE_CONSTANTS.Z_INDEX.GRID,
            }}
          />
        );
      })}

      {/* Horizontal grid lines */}
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          key={`row-grid-${index}`}
          className="absolute left-0 right-0 border-b"
          style={{
            top: `${index * TIMELINE_CONSTANTS.ROW_HEIGHT}px`,
            borderColor: TIMELINE_CONSTANTS.GRID_LINE_COLOR,
            zIndex: TIMELINE_CONSTANTS.Z_INDEX.GRID,
          }}
        />
      ))}

      {/* Today indicator */}
      {isTodayVisible && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: `${todayPosition}px`,
            zIndex: TIMELINE_CONSTANTS.Z_INDEX.GRID + 1,
          }}
        >
          <div className="relative w-0.5 h-full bg-error-500">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-error-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Today
            </div>
          </div>
        </div>
      )}
    </div>
  );
});