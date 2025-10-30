import React, { memo } from "react";
import {
	type TimelineTask,
	type TaskPosition,
} from "../../types/timeline.types";
import { formatDate } from "../../utils/date.utils";
import { TIMELINE_CONSTANTS } from "../../constants/timeline.constants";

interface TaskBarProps {
	task: TimelineTask;
	position: TaskPosition;
	onDragStart: (
		e: React.MouseEvent,
		taskId: string,
		left: number,
		rowId: string
	) => void;
	onResizeStart: (
		e: React.MouseEvent,
		taskId: string,
		edge: "left" | "right",
		left: number,
		width: number
	) => void;
	onClick: (task: TimelineTask) => void;
	isDragging?: boolean;
	isResizing?: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = memo(
	({
		task,
		position,
		onDragStart,
		onResizeStart,
		onClick,
		isDragging = false,
		isResizing = false,
	}) => {
		const handleClick = () => {
			if (!isDragging && !isResizing) {
				onClick(task);
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick(task);
			}
		};

		const ariaLabel = `${task.title}. From ${formatDate(
			task.startDate
		)} to ${formatDate(task.endDate)}. Progress: ${task.progress}%. ${
			task.assignee ? `Assigned to ${task.assignee}.` : ""
		} Press Enter to edit.`;

		if (task.isMilestone) {
			return (
				<div
					className='absolute cursor-pointer transition-all hover:scale-110'
					style={{
						left: `${position.left}px`,
						top: `${position.top}px`,
						zIndex: isDragging
							? TIMELINE_CONSTANTS.Z_INDEX.DRAGGING
							: TIMELINE_CONSTANTS.Z_INDEX.TASK,
					}}
					onClick={handleClick}
					onMouseDown={(e) =>
						onDragStart(e, task.id, position.left, task.rowId)
					}
					role='button'
					tabIndex={0}
					aria-label={ariaLabel}
					onKeyDown={handleKeyDown}
				>
					<div
						className='w-6 h-6 transform rotate-45'
						style={{
							backgroundColor:
								task.color || TIMELINE_CONSTANTS.DEFAULT_TASK_COLOR,
						}}
					/>
					<div className='absolute top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-neutral-700'>
						{task.title}
					</div>
				</div>
			);
		}

		return (
			<div
				className={`absolute rounded shadow-sm cursor-move hover:shadow-lg transition-shadow group ${
					isDragging ? "opacity-50" : ""
				} ${isResizing ? "cursor-ew-resize" : ""}`}
				style={{
					left: `${position.left}px`,
					width: `${position.width}px`,
					top: `${position.top}px`,
					height: `${position.height}px`,
					backgroundColor: task.color || TIMELINE_CONSTANTS.DEFAULT_TASK_COLOR,
					zIndex:
						isDragging || isResizing
							? TIMELINE_CONSTANTS.Z_INDEX.DRAGGING
							: TIMELINE_CONSTANTS.Z_INDEX.TASK,
				}}
				onClick={handleClick}
				onMouseDown={(e) => {
					if (!(e.target as HTMLElement).classList.contains("resize-handle")) {
						onDragStart(e, task.id, position.left, task.rowId);
					}
				}}
				role='button'
				tabIndex={0}
				aria-label={ariaLabel}
				onKeyDown={handleKeyDown}
			>
				<div className='flex items-center justify-between h-full px-2'>
					<span className='text-xs font-medium text-white truncate flex-1'>
						{task.title}
					</span>
					{task.progress > 0 && (
						<span className='text-xs text-white opacity-75 ml-2'>
							{task.progress}%
						</span>
					)}
				</div>

				{/* Progress bar overlay */}
				{task.progress > 0 && (
					<div
						className='absolute bottom-0 left-0 h-1 bg-white opacity-40 rounded-b'
						style={{ width: `${task.progress}%` }}
					/>
				)}

				{/* Resize handles */}
				<div
					className='resize-handle absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white opacity-0 hover:opacity-50 transition-opacity'
					onMouseDown={(e) => {
						e.stopPropagation();
						onResizeStart(e, task.id, "left", position.left, position.width);
					}}
				/>
				<div
					className='resize-handle absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white opacity-0 hover:opacity-50 transition-opacity'
					onMouseDown={(e) => {
						e.stopPropagation();
						onResizeStart(e, task.id, "right", position.left, position.width);
					}}
				/>

				{/* Tooltip on hover */}
				<div className='absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-neutral-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none'>
					{task.title}
					<br />
					{formatDate(task.startDate)} - {formatDate(task.endDate)}
					{task.assignee && (
						<>
							<br />
							{task.assignee}
						</>
					)}
				</div>
			</div>
		);
	}
);
