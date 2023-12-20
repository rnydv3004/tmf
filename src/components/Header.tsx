'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/png.png'
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation'

export default function Header() {

    const [tabToday, setTabToday] = useState('')
    const pathname = usePathname()

    // console.log(pathname)

    return (
        <header className='p-2 px-4 bg-[#fbfbfb]  w-auto h-14 flex justify-between'>
            <div className='h-8 w-fit flex'>
                <Image src={Logo} alt={'Taxmechnaic Logo'} className='h-10 w-auto'
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px" />
            </div>
            <nav className='text-black flex justify-center items-center text-sm font-semibold'>
                <ul className='flex gap-2'>
                    <Link href={'/details'}>
                        <li onClick={() => {
                            setTabToday('today')
                        }} className={`${tabToday === 'today' || pathname === '/details' ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'} rounded-md p-1 cursor-pointer`}><TodayIcon /></li>
                    </Link>
                    <Link href={'/details/calender'}>
                        <li onClick={() => {
                            setTabToday('calender')
                        }} className={`${tabToday === 'calender' || pathname === '/details/calender' ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'} rounded-md p-1 cursor-pointer`}><CalendarMonthIcon /></li>
                    </Link>
                    <li onClick={() => {
                        const response = fetch('/api/userauth')
                        response.then((res) => {
                            if (res.ok) {
                                toast.success('Logout successfully!')
                                window.location.reload();
                            }
                            else{
                                toast.error('Logout failed!')
                            }
                        })


                    }} className={`bg-red-500 text-white rounded-md p-1 cursor-pointer`}><LogoutIcon /></li>
                </ul>
            </nav>
        </header>
    )
}
