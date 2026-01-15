import React from 'react'

const History = () => {

  //get the weeks' data

  const weeks = JSON.parse(localStorage.getItem('weeks')) || []

  if (!weeks.length) {
    return <div className="w-full h-full pt-16 bg-neutral-900 flex items-center justify-center">
      <div className="grid h-130 w-200 gap-4 bg-neutral-800/50 p-5 grid-cols-4 grid-rows-4 rounded-lg shadow-md">

        <div className="col-span-2 row-span-4 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
          <p className='text-xl text-white tracking-widest'>Nothing</p>
        </div>

        <div className="col-span-2 row-span-2 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
          <p className='text-xl text-white tracking-widest'>here</p>
        </div>

        <div className="col-span-2 row-span-2 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
          <p className='text-xl text-white tracking-widest'>for now</p>
        </div>

      </div>
    </div>
  }

  // 1st - tasks - done/total

  const taskStats = {}

  weeks.forEach(week => {
    week.tasks.forEach(task => {
      if (!taskStats[task.title]) {
        taskStats[task.title] = { done: 0, total: 0 }
      }

      taskStats[task.title].done += task.days.filter(Boolean).length
      taskStats[task.title].total += task.days.length

    })

  });

  // 2nd - just past week record

  const lastWeek = weeks.length ? weeks[weeks.length - 1] : null

  // 3rd one done down there

  return (
    <>
      <div className="w-full h-full pt-16 bg-neutral-900 flex items-center justify-center">
        <div className="grid h-130 w-200 gap-4 bg-neutral-800/50 p-5 grid-cols-4 grid-rows-4 rounded-lg shadow-md">

          <div className="col-span-2 row-span-4 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
            <ul className='w-full h-full flex flex-col gap-2 text-white'>
              {Object.entries(taskStats).map(([title, stat]) => (
                <li
                  key={title}
                  className='flex justify-between bg-neutral-800 px-4 py-3 rounded'>
                  <span>{title}</span>
                  <span>
                    {stat.done}/ {stat.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 row-span-2 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
            {lastWeek && (
              <div className='w-full h-full px-6 py-4 text-white '>
                <p className='opacity-66'>Last week</p>
                <p className='text-4xl font-semibold'>
                  {lastWeek.stats.percent}%
                  </p>
              </div>
            )}
          </div>

          <div className="col-span-2 row-span-2 bg-neutral-800/60 rounded-lg shadow-md flex items-center justify-center">
            <ul className="flex flex-col gap-2 text-white">
              {[...weeks].reverse().map(w => (
                <li key={w.weekId} className="flex justify-between bg-neutral-800 px-4 py-3 rounded">
                  <span>{w.weekId}</span>
                  <span>{w.stats.percent}%</span>
                </li>
              ))}

            </ul>
          </div>

        </div>
      </div>
    </>
  )
}

export default History