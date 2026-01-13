import React from 'react'

const History = () => {
  return (
    <>
      <div className="w-full h-full pt-16 bg-neutral-900 flex items-center justify-center">
          <div className="grid h-130 w-200 gap-4 bg-neutral-800 p-5 grid-cols-4 grid-rows-4 rounded-lg shadow-md">

            <div className="col-span-2 row-span-4 bg-neutral-600 rounded-lg shadow-md flex items-center justify-center">
              <p className='text-xl text-white tracking-widest'>WORKING</p>
            </div>

            <div className="col-span-2 row-span-2 bg-neutral-600 rounded-lg shadow-md flex items-center justify-center">
              <p className='text-xl text-white tracking-widest'>ON</p>
            </div>

            <div className="col-span-2 row-span-2 bg-neutral-600 rounded-lg shadow-md flex items-center justify-center">
              <p className='text-xl text-white tracking-widest'>THESE</p>
            </div>

          </div>
      </div>
    </>
  )
}

export default History