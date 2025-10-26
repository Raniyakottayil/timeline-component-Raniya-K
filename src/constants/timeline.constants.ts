

export const TIMELINE_CONSTANTS = {
  // Row dimensions
  ROW_HEIGHT: 64,
  ROW_PADDING: 8,
  TASK_HEIGHT: 32,
  MILESTONE_HEIGHT: 24,
  
  // Left panel
  LEFT_PANEL_WIDTH: 200,
  
  // Time scale
  DAY_WIDTH: 40,
  WEEK_WIDTH: 80,
  MONTH_WIDTH: 120,
  
  // Grid
  GRID_LINE_COLOR: '#e4e4e7',
  TODAY_LINE_COLOR: '#ef4444',
  
  // Task colors
  DEFAULT_TASK_COLOR: '#0ea5e9',
  
  // Dependency lines
  DEPENDENCY_COLOR: '#94a3b8',
  DEPENDENCY_HOVER_COLOR: '#3b82f6',
  
  // Z-index layers
  Z_INDEX: {
    GRID: 1,
    DEPENDENCY: 2,
    TASK: 3,
    DRAGGING: 10,
    SIDEBAR: 20,
    MODAL: 30,
  },
  
  // Animation
  TRANSITION_DURATION: 200,
  
  // Drag thresholds
  DRAG_THRESHOLD: 5,
  
  // Date formats
  DATE_FORMATS: {
    DAY: { weekday: 'short' as const, day: 'numeric' as const },
    WEEK: { month: 'short' as const, day: 'numeric' as const },
    MONTH: { month: 'short' as const, year: 'numeric' as const },
  },
} as const;