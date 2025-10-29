
import React, { useState, useEffect } from "react";
import { type TimelineTask } from "../../types/timeline.types";
import { Button } from "../primitives/Button";
import { Slider } from "../primitives/Slider";
import { Modal } from "../primitives/Modal";

interface TaskDetailSidebarProps {
	task: TimelineTask | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (taskId: string, updates: Partial<TimelineTask>) => void;
	onDelete?: (taskId: string) => void;
	allTasks?: Record<string, TimelineTask>;
}

export const TaskDetailSidebar: React.FC<TaskDetailSidebarProps> = ({
	task,
	isOpen,
	onClose,
	onUpdate,
	onDelete,
	allTasks = {},
}) => {
	const [title, setTitle] = useState("");
	const [progress, setProgress] = useState(0);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [color, setColor] = useState("#0ea5e9");
	const [assignee, setAssignee] = useState("");
	const [dependencies, setDependencies] = useState<string[]>([]);
	const [notes, setNotes] = useState("");
	const [searchDep, setSearchDep] = useState("");

	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setProgress(task.progress);
			setStartDate(task.startDate.toISOString().split("T")[0]);
			setEndDate(task.endDate.toISOString().split("T")[0]);
			setColor(task.color || "#0ea5e9");
			setAssignee(task.assignee || "");
			setDependencies(task.dependencies || []);
			setNotes("");
		}
	}, [task]);

	const handleSave = () => {
		if (!task) return;

		onUpdate(task.id, {
			title,
			progress,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			color,
			assignee: assignee || undefined,
			dependencies,
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

	const handleAddDependency = (depId: string) => {
		if (!dependencies.includes(depId) && depId !== task?.id) {
			setDependencies([...dependencies, depId]);
			setSearchDep("");
		}
	};

	const handleRemoveDependency = (depId: string) => {
		setDependencies(dependencies.filter((id) => id !== depId));
	};

	const filteredTasks = Object.values(allTasks).filter(
		(t) =>
			t.id !== task?.id &&
			t.title.toLowerCase().includes(searchDep.toLowerCase())
	);

	if (!task) return null;

	const footer = (
		<>
			{onDelete && (
				<Button
					variant='secondary'
					onClick={handleDelete}
					className='text-error-600 hover:bg-error-50 mr-auto'
				>
					Delete Task
				</Button>
			)}
			<Button variant='ghost' onClick={onClose}>
				Cancel
			</Button>
			<Button onClick={handleSave} disabled={!title.trim()}>
				Save Changes
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Task Details"
			variant="sidebar"
			footer={footer}
		>
			<div className='space-y-6'>
				{/* Task Title */}
				<div>
					<label
						htmlFor='task-title'
						className='block text-sm font-medium text-neutral-700 mb-2'
					>
						Task Name <span className='text-error-500'>*</span>
					</label>
					<input
						id='task-title'
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
						placeholder='Enter task name'
					/>
				</div>

				{/* Date Range */}
				<div>
					<label className='block text-sm font-medium text-neutral-700 mb-2'>
						Date Range <span className='text-error-500'>*</span>
					</label>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label
								htmlFor='start-date'
								className='block text-xs text-neutral-600 mb-1'
							>
								Start Date
							</label>
							<input
								id='start-date'
								type='date'
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm'
							/>
						</div>
						<div>
							<label
								htmlFor='end-date'
								className='block text-xs text-neutral-600 mb-1'
							>
								End Date
							</label>
							<input
								id='end-date'
								type='date'
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm'
							/>
						</div>
					</div>
				</div>

				{/* Progress Slider */}
				<div>
					<Slider
						label={`Progress: ${progress}%`}
						value={progress}
						onChange={setProgress}
						min={0}
						max={100}
						step={5}
					/>
					<div className='mt-2 flex justify-between text-xs text-neutral-500'>
						<span>Not Started</span>
						<span>In Progress</span>
						<span>Complete</span>
					</div>
				</div>

				{/* Assignee Selector */}
				<div>
					<label
						htmlFor='assignee'
						className='block text-sm font-medium text-neutral-700 mb-2'
					>
						Assignee
					</label>
					<select
						id='assignee'
						value={assignee}
						onChange={(e) => setAssignee(e.target.value)}
						className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
					>
						<option value=''>Unassigned</option>
						<option value='Frontend Team'>Frontend Team</option>
						<option value='Backend Team'>Backend Team</option>
						<option value='Design Team'>Design Team</option>
						<option value='DevOps Team'>DevOps Team</option>
						<option value='QA Team'>QA Team</option>
						<option value='Product Team'>Product Team</option>
					</select>
				</div>

				{/* Dependencies Selector */}
				<div>
					<label className='block text-sm font-medium text-neutral-700 mb-2'>
						Dependencies
					</label>

					{/* Selected Dependencies */}
					{dependencies.length > 0 && (
						<div className='mb-3 space-y-2'>
							{dependencies.map((depId) => {
								const depTask = allTasks[depId];
								return depTask ? (
									<div
										key={depId}
										className='flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-lg'
									>
										<div className='flex items-center gap-2'>
											<div
												className='w-3 h-3 rounded'
												style={{
													backgroundColor: depTask.color || "#0ea5e9",
												}}
											/>
											<span className='text-sm text-neutral-900'>
												{depTask.title}
											</span>
										</div>
										<button
											onClick={() => handleRemoveDependency(depId)}
											className='text-neutral-400 hover:text-error-600 transition-colors'
											aria-label={`Remove ${depTask.title} dependency`}
										>
											<svg
												className='w-4 h-4'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>
										</button>
									</div>
								) : null;
							})}
						</div>
					)}

					{/* Search Dependencies */}
					<div className='relative'>
						<input
							type='text'
							value={searchDep}
							onChange={(e) => setSearchDep(e.target.value)}
							placeholder='Search tasks to add dependency...'
							className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
						/>

						{/* Search Results Dropdown */}
						{searchDep && filteredTasks.length > 0 && (
							<div className='absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10'>
								{filteredTasks.slice(0, 5).map((t) => (
									<button
										key={t.id}
										onClick={() => handleAddDependency(t.id)}
										className='w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 transition-colors'
										disabled={dependencies.includes(t.id)}
									>
										<div
											className='w-3 h-3 rounded'
											style={{ backgroundColor: t.color || "#0ea5e9" }}
										/>
										<span className='text-sm text-neutral-900'>
											{t.title}
										</span>
										{dependencies.includes(t.id) && (
											<span className='ml-auto text-xs text-neutral-500'>
												Added
											</span>
										)}
									</button>
								))}
							</div>
						)}
					</div>
					<p className='mt-1 text-xs text-neutral-500'>
						This task depends on the selected tasks above
					</p>
				</div>

				{/* Notes/Description */}
				<div>
					<label
						htmlFor='notes'
						className='block text-sm font-medium text-neutral-700 mb-2'
					>
						Notes / Description
					</label>
					<textarea
						id='notes'
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={4}
						className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
						placeholder='Add notes or description for this task...'
					/>
				</div>

				{/* Task Color */}
				<div>
					<label
						htmlFor='task-color'
						className='block text-sm font-medium text-neutral-700 mb-2'
					>
						Task Color
					</label>
					<div className='flex items-center gap-3'>
						<input
							id='task-color'
							type='color'
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className='w-16 h-10 border border-neutral-300 rounded cursor-pointer'
						/>
						<input
							type='text'
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className='flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm'
							placeholder='#0ea5e9'
						/>
					</div>
				</div>

				{/* Task Info Card */}
				<div className='bg-neutral-50 rounded-lg p-4 space-y-2'>
					<h3 className='text-sm font-medium text-neutral-900 mb-2'>
						Task Information
					</h3>
					<div className='flex justify-between text-sm'>
						<span className='text-neutral-600'>Task ID:</span>
						<span className='font-mono text-xs text-neutral-900'>
							{task.id}
						</span>
					</div>
					<div className='flex justify-between text-sm'>
						<span className='text-neutral-600'>Row:</span>
						<span className='font-medium text-neutral-900'>{task.rowId}</span>
					</div>
					{task.isMilestone && (
						<div className='flex justify-between text-sm'>
							<span className='text-neutral-600'>Type:</span>
							<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700'>
								Milestone
							</span>
						</div>
					)}
					<div className='flex justify-between text-sm'>
						<span className='text-neutral-600'>Created:</span>
						<span className='text-neutral-900'>Just now</span>
					</div>
				</div>

				{/* Activity Log (Bonus) */}
				<div>
					<h3 className='text-sm font-medium text-neutral-900 mb-3'>
						Activity Log
					</h3>
					<div className='space-y-3'>
						<div className='flex gap-3'>
							<div className='flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-primary-500' />
							<div className='flex-1'>
								<p className='text-sm text-neutral-900'>Task created</p>
								<p className='text-xs text-neutral-500 mt-0.5'>Just now</p>
							</div>
						</div>
						{progress > 0 && (
							<div className='flex gap-3'>
								<div className='flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-success-500' />
								<div className='flex-1'>
									<p className='text-sm text-neutral-900'>
										Progress updated to {progress}%
									</p>
									<p className='text-xs text-neutral-500 mt-0.5'>
										A few moments ago
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};