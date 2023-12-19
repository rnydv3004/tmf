'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/png.png'
import toast from 'react-hot-toast'

export default function Userauth() {


    // const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        user : '',
        password : ''
    })

    async function userAuth(){
        if(user.user !== '' && user.password !== '')
        {
            setLoading(true)
            const response = await fetch('/api/userauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })

            // console.log(response.status)
            
            if (!response.ok) {
                // Handle non-successful response (e.g., error handling)
                toast.error("Wrong credentials!")
                setLoading(false)
            } else {
                // Event added successfully
                setLoading(false)
                toast.success('Signed in successfully!')
                window.location.reload();
            }
        }
        else{
            toast.error('Please fill user and password')
        }
    }


    return (
        <div className='h-screen w-screen overflow-hidden bg-slate-300 text-black flex justify-center items-center'>
            <div className='bg-white w-fit h-fit flex flex-col justify-center items-center p-10 rounded-lg shadow-sm'>
                <div className='h-8 w-fit flex mb-5 justify-center items-center'>
                    <Image src={Logo} alt={'Taxmechnaic Logo'} className='h-10 w-auto'
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px" />
                </div>
                {/* user */}
                <div className='mt-2'>
                    <label htmlFor="user" className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs">username <span className='text-red-500'>*</span></label>
                    <div className="mt-0.5">
                        <input type="text" name="user" id="user" value={user.user} autoComplete="given-name" onChange={(e) => {
                            e.preventDefault()
                            setUser({ ...user, user: e.target.value })
                        }} className="bg-[#FFEBCD] text-[#8B4513] w-full rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm" />
                    </div>
                </div>
                <div className='mt-4'>
                    <label htmlFor="last-name" className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs">password <span className='text-red-500'>*</span></label>
                    <div className="mt-0.5">
                        <input type="password" name="last-name" id="last-name" value={user.password} onChange={(e) => {
                            e.preventDefault()
                            setUser({ ...user, password: e.target.value })
                        }} autoComplete="family-name" className="bg-[#FFEBCD] text-[#8B4513] w-full rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm" />
                    </div>
                </div>
                <div className="mt-8">
                    <button 
                    onClick={()=>{
                        userAuth()
                    }}
                    type="submit" className="bblock w-fit rounded-md text-[#FFEBCD] bg-[#e1ac27] z-40 px-5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-[#bb8f22] active:bg-[#bb8f22] focus-visible:outline  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >Log in</button>
                </div>
            </div>
        </div>
    )
}
