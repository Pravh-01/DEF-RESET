import React, { useState, useEffect } from 'react'
import initialList from '../data/initialList'
import { toast, Flip } from 'react-toastify'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const Current = () => {
	const [isFirstVisit, setIsFirstVisit] = useState(
		!localStorage.getItem('visitedBefore')
	)

	const isMonday = new Date().getDay() === 1

	const todayIndex = (() => {
		const d = new Date().getDay()
		return d === 0 ? 6 : d - 1
	})()

	const getWeekKey = () => {
		const now = new Date()
		const year = now.getFullYear()
		const week = Math.ceil(
			(((now - new Date(year, 0, 1)) / 86400000) +
				new Date(year, 0, 1).getDay() +
				1) / 7
		)
		return `${year}-W${week}`
	}

	// ===== WEEK KEY =====
	const [weekKey, setWeekKey] = useState(getWeekKey())

	// ===== TRACKER =====
	const [tracker, setTracker] = useState(() => {
		const saved = localStorage.getItem('tracker')
		return saved
			? JSON.parse(saved)
			: initialList.map((task, i) => ({
				id: i + 1,
				title: task.task,
				days: Array(7).fill(false),
			}))
	})

	const liveCompleted = tracker.reduce(
		(sum, task) => sum + task.days.filter(Boolean).length,
		0
	)
	const liveTotal = tracker.length * 7

	// ===== SAVE TRACKER + WEEK =====
	useEffect(() => {
		localStorage.setItem('tracker', JSON.stringify(tracker))
		localStorage.setItem('trackerWeek', weekKey)
	}, [tracker, weekKey])

	// ===== TOGGLE =====
	const toggleDayCheck = (taskIndex, dayIndex) => {
		setTracker(prev =>
			prev.map((task, i) =>
				i !== taskIndex
					? task
					: {
						...task,
						days: task.days.map((d, j) =>
							j === dayIndex ? !d : d
						),
					}
			)
		)
	}

	// ===== EDIT RULES =====
	const isLocked = localStorage.getItem('lockedWeek') === weekKey
	const canEditTasks = !isLocked && (isFirstVisit || isMonday)

	const updateTitle = (id, value) => {
		if (!canEditTasks) return
		setTracker(prev =>
			prev.map(task =>
				task.id === id ? { ...task, title: value } : task
			)
		)
	}

	const finalizeTitle = (id, value) => {
		const trimmed = value.trim()
		setTracker(prev =>
			prev.map(task =>
				task.id === id
					? { ...task, title: trimmed || task.title }
					: task
			)
		)
	}

	const addTask = () => {
		if (!canEditTasks) return
		setTracker(prev => [
			...prev,
			{
				id: prev.length + 1,
				title: 'New Task',
				days: Array(7).fill(false),
			},
		])
	}

	const removeTask = id => {
		if (!canEditTasks) return
		setTracker(prev =>
			prev
				.filter(t => t.id !== id)
				.map((t, i) => ({ ...t, id: i + 1 }))
		)
	}

	// ===== STATS =====
	const computeStats = tasks => {
		const total = tasks.length * 7
		const completed = tasks.reduce(
			(sum, t) => sum + t.days.filter(Boolean).length,
			0
		)
		return {
			total,
			completed,
			percent: total ? Math.round((completed / total) * 100) : 0,
		}
	}

	// ===== HISTORY =====
	const [weeks, setWeeks] = useState(() => {
		const saved = localStorage.getItem('weeks')
		return saved ? JSON.parse(saved) : []
	})

	const saveFinishedWeek = (finishedWeekKey, finishedTracker) => {
		const finishedWeek = {
			weekId: finishedWeekKey,
			tasks: finishedTracker,
			stats: computeStats(finishedTracker),
		}

		setWeeks(prev => [...prev, finishedWeek])
	}

	useEffect(() => {
		localStorage.setItem('weeks', JSON.stringify(weeks))
	}, [weeks])

	// ===== HANDLE MISSED WEEK ON LOAD =====
	useEffect(() => {
		const savedWeek = localStorage.getItem('trackerWeek')
		const currentWeek = getWeekKey()

		if (savedWeek && savedWeek !== currentWeek) {
			const savedTracker = JSON.parse(localStorage.getItem('tracker'))

			saveFinishedWeek(savedWeek, savedTracker)

			setTracker(
				savedTracker.map((t, i) => ({
					...t,
					id: i + 1,
					days: Array(7).fill(false),
				}))
			)

			localStorage.setItem('trackerWeek', currentWeek)
			localStorage.removeItem('lockedWeek')
			setWeekKey(currentWeek)
		}
	}, [])

	// ===== WEEK CHANGE INTERVAL =====
	useEffect(() => {
		const interval = setInterval(() => {
			const currentKey = getWeekKey()
			if (currentKey !== weekKey) {
				saveFinishedWeek(weekKey, tracker)

				setTracker(prev =>
					prev.map((t, i) => ({
						...t,
						id: i + 1,
						days: Array(7).fill(false),
					}))
				)

				localStorage.setItem('trackerWeek', currentKey)
				localStorage.removeItem('lockedWeek')
				setWeekKey(currentKey)
			}
		}, 60 * 1000)

		return () => clearInterval(interval)
	}, [weekKey, tracker])

	// ===== LOCK =====
	const lockTasks = () => {
		localStorage.setItem('visitedBefore', 'true')
		localStorage.setItem('lockedWeek', weekKey)
		setIsFirstVisit(false)

		toast.success('Locked In for Week', {
			position: 'bottom-center',
			autoClose: 1000,
			theme: 'dark',
			transition: Flip,
		})
	}

	return (
		<div className="w-[80vw] h-full pt-30 flex flex-col items-center">

			{/* STATS */}
			<div className="absolute top-2 right-2 bg-neutral-800 px-6 py-4 rounded-xl text-white">
				<p className="opacity-80">
					This week: {liveCompleted} / {liveTotal}
				</p>
				<div className="h-2 bg-neutral-700 rounded">
					<div
						className="h-2 bg-green-400 rounded"
						style={{ width: `${(liveCompleted / liveTotal) * 100 || 0}%` }}
					/>
				</div>
			</div>

			<div className="w-[76%] flex justify-center">

				{/* TASKS */}
				<ul className="w-66 text-white">
					<li className="h-12" />
					{tracker.map(task => (
						<li
							key={task.id}
							className="group flex items-center h-16 px-4 gap-2 rounded-lg hover:bg-neutral-800"
						>
							<p>{task.id}.</p>

							{canEditTasks ? (
								<input
									value={task.title}
									onChange={e => updateTitle(task.id, e.target.value)}
									onBlur={e => finalizeTitle(task.id, e.target.value)}
									className="bg-transparent outline-none flex-1"
								/>
							) : (
								<p className="flex-1">{task.title}</p>
							)}

							{canEditTasks && (
								<button
									onClick={() => removeTask(task.id)}
									className="opacity-0 group-hover:opacity-100"
								>
									✕
								</button>
							)}
						</li>
					))}
				</ul>

				{/* CALENDAR */}
				<div>
					<ul className="flex h-12 text-white/50">
						{DAYS.map((day, i) => (
							<li
								key={day}
								className={`w-24 text-center ${i === todayIndex
										? 'text-white text-shadow-[0_0_36px_white]'
										: ''
									}`}
							>
								{day}
							</li>
						))}
					</ul>

					{tracker.map((task, row) => (
						<div key={task.id} className="h-16 grid grid-cols-7 place-items-center">
							{task.days.map((checked, col) => {
								const isPast = col < todayIndex
								return (
									<div
										key={col}
										onClick={() => {
											if (isPast || col !== todayIndex) return
											toggleDayCheck(row, col)
										}}
										className={`w-8 h-8 rounded ${checked
												? 'bg-green-400'
												: isPast
													? 'bg-red-400'
													: 'bg-white/90'
											}`}
									/>
								)
							})}
						</div>
					))}
				</div>
			</div>

			{/* ACTIONS */}
			<div className="flex gap-6 w-[76%]">
				{canEditTasks && (
					<button onClick={addTask} className="bg-neutral-800 h-16 w-66">
						+ Add task
					</button>
				)}

				{!isLocked && (isFirstVisit || isMonday) && (
					<button onClick={lockTasks} className="bg-neutral-800 h-16 w-66">
						◇ Lock tasks
					</button>
				)}
			</div>
		</div>
	)
}

export default Current
