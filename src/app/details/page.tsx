'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../../public/png.png'
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AppointmentDetails from '@/components/AppointmentDetails'

export default function page() {

    const [tabToday, setTabToday] = useState(true)
    
    return (
        <div className='bg-slate-300 h-screen w-screen flex flex-col overflow-hidden'>
            <header className='p-2 px-4 bg-white w-auto h-14 flex justify-between'>
                <div className='h-8 w-fit flex'>
                    <Image src={Logo} alt={'Taxmechnaic Logo'} className='h-10 w-auto'
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px" />
                </div>
                <nav className='text-black flex justify-center items-center text-sm font-semibold'>
                    <ul className='flex gap-2'>
                        <li onClick={() => {
                            setTabToday(true)
                        }} className={`${tabToday ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'} rounded-md p-2 cursor-pointer`}><TodayIcon /></li>
                        <li onClick={() => {
                            setTabToday(false)
                        }} className={`${!tabToday ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'} rounded-md p-2 cursor-pointer`}><CalendarMonthIcon /></li>
                    </ul>
                </nav>
            </header>
            <section className='flex flex-col md:flex-row gap-2 h-full w-auto my-1 md:m-2'>
                {tabToday ? (<div className='flex flex-col gap-2 h-full w-full bg-white rounded-md p-2'>
                    <p className='text-sm font-semibold text-slate-800 pl-4'>Today's Schedule: <span className='p-1 px-2 text-xs bg-slate-500 rounded-sm text-white'>2023-09-20</span></p>
                    <div className='h-full w-full flex overflow-scroll'><AppointmentDetails date={'2023-09-20'}/></div>
                </div>) :
                    (<div className='flex flex-col gap-2 h-full w-full bg-white rounded-md p-2'>
                        <p className='text-sm font-semibold text-slate-800 pl-4'>All Appoitments</p>
                        <div className='h-full w-full flex overflow-scroll'><AppointmentDetails date={''}/></div>
                    </div>)}
            </section>
        </div>
    )
}
