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

	// ===== CURRENT WEEK TRACKER =====
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


	useEffect(() => {
		localStorage.setItem('tracker', JSON.stringify(tracker))
	}, [tracker])


	const getWeekKey = () => {
		const now = new Date()
		const year = now.getFullYear()
		const week = Math.ceil(
			(((now - new Date(year, 0, 1)) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7
		)
		return `${year}-W${week}`
	}

	// ===== PAST WEEKS =====
	const [weekKey, setWeekKey] = useState(getWeekKey())

	// ===== TOGGLE DAY =====
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


	// ===== UPDATE TITLE (MONDAY ONLY) =====
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


	// ===== ADD TASK (MONDAY ONLY) =====
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

	// ===== REMOVE TASK + RENUMBER (MONDAY ONLY) =====
	const removeTask = (id) => {
		if (!canEditTasks) return

		setTracker(prev =>
			prev
				.filter(task => task.id !== id)
				.map((task, index) => ({
					...task,
					id: index + 1,
				}))
		)
	}

	// ===== COMPUTE STATS =====
	const computeStats = (tasks) => {
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

	const [weeks, setWeeks] = useState(() => {
		const saved = localStorage.getItem('weeks')
		return saved ? JSON.parse(saved) : []
	})

	// ===== SAVE WEEK + RESET =====
	const createNewWeek = () => {
		const finishedWeek = {
			weekId: weekKey,
			tasks: tracker,
			stats: computeStats(tracker),
		}

		setWeeks(prev => [...prev, finishedWeek])

		setTracker(prev =>
			prev.map((task, i) => ({
				...task,
				id: i + 1,
				days: Array(7).fill(false),
			}))
		)

		localStorage.removeItem('lockedWeek')
		setIsLocked(false)

	}
	// ===== saving weeks to localStorage =====
	useEffect(() => {
		localStorage.setItem('weeks', JSON.stringify(weeks))
	}, [weeks])

	// ===== new week when needed =====
	useEffect(() => {
		const interval = setInterval(() => {
			const currentKey = getWeekKey()
			if (currentKey !== weekKey) {
				createNewWeek()
				setWeekKey(currentKey)
			}
		}, 60 * 1000) // check every minute

		return () => clearInterval(interval)
	}, [weekKey, tracker])

	const [isLocked, setIsLocked] = useState(() => {
		const saved = localStorage.getItem('lockedWeek')
		return saved === getWeekKey()
	})

	const canEditTasks = !isLocked && (isFirstVisit || isMonday)


	const lockTasks = () => {
		localStorage.setItem('visitedBefore', 'true')
		localStorage.setItem('lockedWeek', getWeekKey())
		setIsLocked(true)
		setIsFirstVisit(false)

		toast.success('Locked In for Week', {
			position: "bottom-center",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: false,
			draggable: true,
			progress: undefined,
			theme: "dark",
			transition: Flip,
		});
	}

	return (
		<div className="w-[80vw] h-full pt-30 flex flex-col gap-1 items-center">

			<div className="absolute bg-neutral-800 h-max w-max flex flex-col gap-1 py-4 px-6 rounded-xl top-2 right-2">
				<p className="text-white w-max opacity-80">
					This week: {liveCompleted} / {liveTotal}
				</p>

				<div className="w-full h-2 bg-neutral-700 rounded">
					<div
						className="h-2 bg-green-400 rounded transition-all"
						style={{ width: `${(liveCompleted / liveTotal) * 100 || 0}%` }}
					/>
				</div>


			</div>

			<div className="w-[76%] h-max flex justify-center">
				{/* TASK LIST */}
				<ul className=" w-66 h-max flex flex-col gap-1 text-white">
					<li className="h-12" />

					{tracker.map(task => (
						<li
							key={task.id}
							className="group flex items-center justify-evenly h-16 px-4 gap-2 rounded-lg hover:bg-neutral-800 transition"
						>
							<p className="px-1">{task.id}.</p>

							{canEditTasks ? (
								<input
									value={task.title}
									onChange={e => updateTitle(task.id, e.target.value)}
									onBlur={e => finalizeTitle(task.id, e.target.value)}
									className="bg-transparent outline-none text-white flex-1"
								/>
							) : (
								<p className="flex-1">{task.title}</p>
							)}

							{canEditTasks && (
								<button
									onClick={() => removeTask(task.id)}
									className=" opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
								>
									✕
								</button>
							)}
						</li>

					))}
				</ul>

				{/* CALENDAR */}
				<div className=" h-max flex flex-col gap-1">

					{/* DAY NAMES */}
					<ul className="flex h-12 text-white/50">
						{DAYS.map((day,i) => {
							const isToday = i===todayIndex;

							return (
							<li key={day} className={`w-24 flex justify-center items-center text-center ${isToday ? 'text-white text-shadow-[0_0_36px_white]' : ''}`}>{day}</li>
						)})}
					</ul>

					{/* GRID */}
					<div className="flex flex-col gap-1">
						{tracker.map((task, row) => (
							<div key={task.id} className="h-16 grid grid-cols-7 place-items-center">
								{task.days.map((checked, col) => {

									const isPastDay = col < todayIndex
									const isMissed = isPastDay && !checked
									return (
										<div
											key={col}
											onClick={() => {
												if (isPastDay) return
												if (col != todayIndex) return 
												toggleDayCheck(row, col)
											}}
											className={`w-8 h-8 rounded cursor-pointer transition
											${checked
													? 'bg-green-400'
													: isMissed
														? 'bg-red-400'
														: 'bg-white/90'
												}`}
										>
											{/* {checked && (
												<svg
													className="w-full h-full pointer-events-none"
													viewBox="0 0 1024 1024"
													fill="#000"
												>
													<path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z" />
												</svg>
											)} */}
										</div>
									)
								})}
							</div>
						))}
					</div>

				</div>
			</div>

			<div className="flex w-[76%] h-max gap-6">
				{canEditTasks && (
					<button
						onClick={addTask}
						className="h-16 w-66 text-white px-4 gap-2 rounded-lg bg-neutral-800 hover:bg-neutral-800/80 cursor-pointer transition">
						+ Add task
					</button>
				)}

				{!isLocked && (isFirstVisit || isMonday) && (
					<button
						onClick={lockTasks}
						className="h-16 w-66 text-white px-4 gap-2 rounded-lg bg-neutral-800 hover:bg-neutral-800/80 cursor-pointer transition"
					>
						◇ Lock tasks
					</button>
				)}

			</div>
		</div>
	)
}

export default Current
