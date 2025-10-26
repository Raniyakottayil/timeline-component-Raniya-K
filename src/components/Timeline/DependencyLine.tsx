// src/components/Timeline/DependencyLine.tsx

import React, { memo } from 'react';
import {type DependencyLineData } from '../../types/timeline.types';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';

interface DependencyLineProps {
  line: DependencyLineData;
  isHighlighted?: boolean;
}

export const DependencyLine: React.FC<DependencyLineProps> = memo(({
  line,
  isHighlighted = false,
}) => {
  const { x1, y1, x2, y2 } = line;

  // Calculate path with right-angle connectors
  const midX = x1 + (x2 - x1) / 2;
  const path = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

  const strokeColor = isHighlighted 
    ? TIMELINE_CONSTANTS.DEPENDENCY_HOVER_COLOR 
    : TIMELINE_CONSTANTS.DEPENDENCY_COLOR;

  return (
    <g>
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={isHighlighted ? 3 : 2}
        fill="none"
        markerEnd="url(#arrowhead)"
        className="transition-all"
      />
    </g>
  );
});