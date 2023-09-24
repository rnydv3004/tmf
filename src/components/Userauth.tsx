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
                    <label htmlFor="user" className="block text-sm font-medium leading-6 text-gray-700">username <span className='text-red-500'>*</span></label>
                    <div className="mt-0.5">
                        <input type="text" name="user" id="user" value={user.user} autoComplete="given-name" onChange={(e) => {
                            e.preventDefault()
                            setUser({ ...user, user: e.target.value })
                        }} className="block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className='mt-4'>
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-700">password <span className='text-red-500'>*</span></label>
                    <div className="mt-0.5">
                        <input type="password" name="last-name" id="last-name" value={user.password} onChange={(e) => {
                            e.preventDefault()
                            setUser({ ...user, password: e.target.value })
                        }} autoComplete="family-name" className="block w-full rounded-md border-2 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="mt-8">
                    <button 
                    onClick={()=>{
                        userAuth()
                    }}
                    type="submit" className="block w-full rounded-md bg-blue-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 active:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >Log in</button>
                </div>
            </div>
        </div>
    )
}
