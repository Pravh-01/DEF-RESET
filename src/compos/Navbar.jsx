import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Navbar = () => {

    const tabs = ['Current', 'History']
    const { pathname } = useLocation()
    const activeTab = pathname === '/' ? 'Current' : 'History';

    return (
        <div className='w-max h-max bg-linear-to-b from-black/36 to-neutral-700 backdrop-blur-lg fixed -top-4 p-4 pt-8 rounded-2xl flex gap-4 items-center justify-center'>
            {tabs.map((tab, i) => {
                return <Link
                    to={`/${tab == 'Current' ? '' : tab}`}
                    key={i}
                    className={`${activeTab == tab ? 'bg-white' : 'bg-transparent text-white'} font-medium tracking-wider py-2 px-5 border-2 border-neutral-300 transition rounded-lg cursor-pointer active:scale-95`}
                    // onClick={()=> dispatch(setActiveTab(tab)) }
                >
                    {tab}
                </Link>
            })}
        </div>

    )
}

export default Navbar;