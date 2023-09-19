'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import Logo from './../../public/png.png'
import Image from 'next/image'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import Link from 'next/link';


export default function Formcomponent() {

    const [dateValue, setDateValue] = useState();
    const [dialog, setDialog] = useState(false);
    const [loading, setLoading] = useState(true)
    const [bookingStatus, setBookingStatus] = useState(true)
    const [dateSlots, setDateSlots]:any = useState()
    const [allSlots, setAllSlots] = useState([])
    const [availableSlot, setAvailableSlot] = useState([])
    const [selectedSlot, setSelectedSlot] = useState('')
    const [calenderLoader, setCalenderLoader] = useState(true)
    const [timeLoader, setTimeLoader] = useState(false)
    const [appointmentDetails, setAppointmentDetails] = useState({
        firstName: '',
        lastName: '',
        type: '',
        email: '',
        phone: '',
        message: '',
        date: '',
        time: ''
    })

    function checkFields() {
        if (appointmentDetails.firstName === '' || appointmentDetails.type === '' || appointmentDetails.phone === '' || appointmentDetails.email === '' || appointmentDetails.date === '' || appointmentDetails.time === '') {
            toast.error("Please fill required details")
            return false
        }
        return true
    }

    async function bookAppointment() {
        try {
            const response = await fetch('/api/bookappointment', {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify(appointmentDetails), // Convert the object to JSON and set it as the body
            });
            if (!response.ok) {
                // Handle error if the response status is not OK (e.g., 404, 500).
                throw new Error(`Error fetching data. Status: ${response.status}`);
            }

            const data = await response.json(); // Parse the response JSON data

            const mailResponse = await fetch('/api/mailer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentDetails),
            });
            if (!mailResponse.ok) {
                // Handle error if the response status is not OK (e.g., 404, 500).
                toast.error('Error in sending mail. Our team will connect you by phone')
                throw new Error(`Error fetching data. Status: ${response.status}`);
            }

            toast.success('Confirmation email sent')

            return data;

        } catch (error) {
            // console.error("Error fetching data:", error);
            throw error;
        }
    }

    function chips(text: string, state: boolean, index: number) {
        return (<button
            key={index}
            type='button'
            disabled={state}
            className={`disabled:bg-slate-500 ${selectedSlot === text ? 'bg-green-600' : 'bg-blue-500'} h-fit w-fit py-1 px-5 rounded-full text-sm transition-transform transform ease-in-out duration-300 hover:scale-105 active:scale-100 select-none cursor-pointer text-white`}
            onClick={(e) => {
                e.preventDefault()
                setSelectedSlot(text)
                setAppointmentDetails({ ...appointmentDetails, time: text })
                // console.log("Seleted slot:", selectedSlot)
            }}
        >
            {text}
        </button>)
    }

    async function fetchDates() {

        try {
            const response = await fetch('/api/getdate')

            if (!response.ok) {
                // Handle error if the response status is not OK (e.g., 404, 500).
                throw new Error(`Error fetching data. Status: ${response.status}`);
            }

            const data = await response.json(); // Parse the response JSON data

            return data; // Return the data if needed

        } catch (error) {
            // console.error("Error fetching data:", error);
            throw error; // Rethrow the error for higher-level error handling if needed
        }
    }

    useEffect(() => {
        const dates = fetchDates()

        dates.then((data) => {
            setDateSlots(data)
            setCalenderLoader(false)
        })

    }, [])

    async function fetchSlots(checkDate: any) {

        try {
            const response = await fetch('/api/gettime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify({
                    "checkdate": checkDate
                })
            })

            if (!response.ok) {
                // Handle error if the response status is not OK (e.g., 404, 500).
                throw new Error(`Error fetching data. Status: ${response.status}`);
            }

            const data = await response.json(); // Parse the response JSON data

            // console.log("Time: ", data)
            return data; // Return the data if needed

        } catch (error) {
            // console.error("Error fetching data:", error);
            throw error; // Rethrow the error for higher-level error handling if needed
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (checkFields()) {
            // console.log('Booking Appointment')
            setDialog(true)
            try {
                // Call your bookAppointment function here
                const response = await bookAppointment();
                // console.log(response)
                if (response.status === 200) {
                    setLoading(false)
                    setBookingStatus(true)
                } else {
                    setLoading(false)
                    setBookingStatus(false)
                }

            } catch (error) {
                // console.error("Error in booing details form: Please try again later", error);
                // Handle the error here if needed
            }
        }
    };


    return (
        <div className="isolate px-6 py-10 sm:py-12 lg:px-8 shadow-sm shadow-slate-500 rounded-lg">

            {dialog ? (<div className='flex justify-center items-center w-screen h-screen absolute top-0 bottom-0 left-0 right-0 z-50 bg-slate-300'>
                <div className='flex flex-col bg-white rounded-lg p-5 lg:p-10 justify-center items-center gap-6 m-10'>

                    {!loading ? (
                        <div className='flex flex-col justify-center items-center gap-5 '>
                            <div className='h-16 w-fit flex'>
                                <Image src={Logo} alt={'Taxmechnaic Logo'} className='h-16 w-auto'
                                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px" />
                            </div>
                            {bookingStatus ? (<h1 className='text-green-700 text-xs text-center font-bold flex-wrap'>Thanks for booking appointment with Taxmechanic. The meeting link will be share on mail.</h1>) : (
                                <h1 className='text-red-700 text-xs text-center font-bold flex-wrap'>Booking Falied due to some technical error! Please try again later.</h1>
                            )}
                            <Link href={'https://www.taxmechanic.ca/'}><p className='py-2 px-4 bg-blue-500 rounded-full text-sm font-semibold'>Visit us</p></Link>
                        </div>
                    ) :
                        (<span className="loader"></span>)}
                </div>
            </div>) :
                (<div className='flex flex-col justify-center'>
                    <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#fcdb89] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                        }}></div>
                    </div>

                    <div className="mx-auto max-w-2xl text-center flex justify-center items-center flex-col gap-2">
                        <div className='h-16 w-fit flex'>
                            <Image src={Logo} alt={'Taxmechnaic Logo'} className='h-16 w-auto'
                                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px" />
                        </div>
                        {/* <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Taxmechanic</h2> */}
                        <p className="mt-2 text-sm md:text-base leading-5 text-gray-600">Book a free Appointment with our one of best tax consultant</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl sm:mt-12">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name <span className='text-red-500'>*</span></label>
                                <div className="mt-2.5">
                                    <input type="text" name="first-name" id="first-name" value={appointmentDetails.firstName} autoComplete="given-name" onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, firstName: e.target.value })
                                    }} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                                <div className="mt-2.5">
                                    <input type="text" name="last-name" id="last-name" value={appointmentDetails.lastName} onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, lastName: e.target.value })
                                    }} autoComplete="family-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">Company/Individual <span className='text-red-500'>*</span></label>
                                <div className="mt-2.5">
                                    <input type="text" value={appointmentDetails.type} name="company" id="company" onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, type: e.target.value })
                                    }} autoComplete="organization" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email <span className='text-red-500'>*</span></label>
                                <div className="mt-2.5">
                                    <input type="email" name="email" value={appointmentDetails.email} id="email" onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, email: e.target.value })
                                    }} autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number <span className='text-red-500'>*</span></label>
                                <div className="relative mt-2.5 flex">
                                    <div className="block w-fit rounded-tl-md rounded-bl-md border-0 px-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <label htmlFor="country" className="sr-only">Country</label>
                                        <select id="country" name="country" className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-2 pr-4 text-gray-400 sm:text-sm outline-none">
                                            {/* <option>US</option> */}
                                            <option>CA</option>
                                            {/* <option>EU</option> */}
                                        </select>
                                    </div>
                                    <input type="tel" name="phone-number" id="phone-number" value={appointmentDetails.phone} onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, phone: e.target.value })
                                    }} autoComplete="tel" className="block w-full rounded-tr-md rounded-br-md border-0 px-3.5 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                                <div className="mt-2.5">
                                    <textarea value={appointmentDetails.message} onChange={(e) => {
                                        e.preventDefault()
                                        setAppointmentDetails({ ...appointmentDetails, message: e.target.value })
                                    }} name="message" id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-center items-center flex-col border-2 py-5 mt-10 rounded-lg'>

                            {calenderLoader ? (<div className='flex flex-col gap-2 justify-center items-center'><span className="loader absolute w-full h-full top-0 bottom-0 left-0 right-0 z-50"></span><span className='text-xs font-semibold text-amber-600'>Loading Available Slots...</span></div>) : (<div className='bg-white rounded-lg p-0 text-black font-semibold text-xs'>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        value={dateValue}
                                        onChange={(newValue: any) => {
                                            setTimeLoader(true)
                                            setAppointmentDetails({ ...appointmentDetails, date: newValue.format('YYYY-MM-DD') })
                                            const timeInfo = fetchSlots(newValue.format('YYYY-MM-DD'))
                                            timeInfo.then((data) => {
                                                setAllSlots(data.value)
                                                setAvailableSlot(data.availableSlots)
                                                setTimeLoader(false)
                                                // console.log("All slots:", allSlots)
                                                // console.log("Av slots:", availableSlot)
                                            })

                                        }}
                                        minDate={dayjs(dateSlots.first)}
                                        maxDate={dayjs(dateSlots.second)}

                                        disablePast={true}
                                    />
                                </LocalizationProvider>
                            </div>)}





                            <div className='flex flex-wrap gap-2 w-full justify-center items-center max-w-sm'>

                                {
                                    timeLoader ? (<span className="loader"></span>) : (
                                        <div className='flex justify-center items-center flex-wrap gap-2'>
                                            {
                                                allSlots.map((time,index) => {
                                                    const isAvailable = availableSlot.includes(time);

                                                    return (
                                                        <div key={index} className='flex justify-center items-center gap-2'>
                                                                {chips(time, !isAvailable,index)}
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    )
                                }

                            </div>
                        </div>


                        <div className="mt-10">
                            <button type="submit" className="block w-full rounded-md bg-blue-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 active:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" >Confirm</button>
                        </div>
                    </form>

                </div>)}


        </div>
    )
}
