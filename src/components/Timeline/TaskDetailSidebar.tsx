// src/components/Timeline/TaskDetailSidebar.tsx

import React, { useState, useEffect } from 'react';
import { type TimelineTask } from '../../types/timeline.types';
import { Button } from '../primitives/Button';
import { Slider } from '../primitives/Slider';
import { formatDate } from '../../utils/date.utils';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';

interface TaskDetailSidebarProps {
  task: TimelineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<TimelineTask>) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskDetailSidebar: React.FC<TaskDetailSidebarProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setProgress(task.progress);
      setStartDate(task.startDate.toISOString().split('T')[0]);
      setEndDate(task.endDate.toISOString().split('T')[0]);
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!task) return;

    onUpdate(task.id, {
      title,
      progress,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    onClose();
  };

  const handleDelete = () => {
    if (!task || !onDelete) return;
    
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 animate-fade-in"
        style={{ zIndex: TIMELINE_CONSTANTS.Z_INDEX.SIDEBAR - 1 }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-modal overflow-y-auto animate-slide-up"
        style={{ zIndex: TIMELINE_CONSTANTS.Z_INDEX.SIDEBAR }}
        role="complementary"
        aria-label="Task details"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-neutral-700 mb-2">
              Task Name
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter task name"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-neutral-700 mb-2">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-neutral-700 mb-2">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <Slider
              label={`Progress (${progress}%)`}
              value={progress}
              onChange={setProgress}
              min={0}
              max={100}
              step={5}
            />
          </div>

          {/* Task Info */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Assignee:</span>
              <span className="font-medium text-neutral-900">{task.assignee || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Row:</span>
              <span className="font-medium text-neutral-900">{task.rowId}</span>
            </div>
            {task.dependencies && task.dependencies.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Dependencies:</span>
                <span className="font-medium text-neutral-900">{task.dependencies.length}</span>
              </div>
            )}
          </div>

          {/* Task Color */}
          <div>
            <label htmlFor="task-color" className="block text-sm font-medium text-neutral-700 mb-2">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="task-color"
                type="color"
                value={task.color || '#0ea5e9'}
                onChange={(e) => onUpdate(task.id, { color: e.target.value })}
                className="w-12 h-10 border border-neutral-300 rounded cursor-pointer"
              />
              <span className="text-sm text-neutral-600">{task.color || '#0ea5e9'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between gap-3">
          {onDelete && (
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="text-error-600 hover:bg-error-50"
            >
              Delete
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};