'use client'
import React, { useEffect, useState } from 'react';
import AppointmentDetails from '@/components/AppointmentDetails';
import { DateTime } from 'luxon';

export default function Page() {

  const [transformedData, setTransformmedData]:any = useState([])
  const now = DateTime.now().setZone('America/Toronto');
  const today = now.toFormat('yyyy-MM-dd');
  // console.log("Today is:", today);
  fetch('http://localhost:3000/api/getdata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
    body: JSON.stringify({
      "date": today
    })
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Error fetching data. Status: ${response.status}`);
      }
  
      const resdata = await response.json();
      // console.log("The data is:", resdata);
  
      let idCounter = 1;
  
      // Convert the input data into the desired format
      const transformedDataTemp = Object.entries(resdata.data).map(([phone, details]: [string, any]) => ({
        id: idCounter++, // You can set an appropriate ID here
        lastName: details.lastName,
        firstName: details.fullName,
        phone: parseInt(phone, 10), // Convert phone to a number
        email: details.email || '',
        date: details.date || '',
        time: details.time || ''
      }));
  
      // console.log("Transformed data:", transformedDataTemp);
      
      // Ensure that setTransformedData is correctly defined and updates the state
      
      setTransformmedData(transformedDataTemp);
      // console.log("After setting state");
      // console.log("Transformed data in state:", transformedData);
    })
    .catch((error) => {
      console.error("Error:", error);
    })
  
  return (
    <div className='flex flex-col gap-2 h-[calc(100vh-4rem)] w-full bg-white p-2'>
      <p className='text-sm font-semibold text-slate-800 pl-4'>Today's Schedule: <span className='p-1 px-2 text-xs bg-slate-500 rounded-full text-white'>{today}</span></p>
      <div className="h-full w-full flex overflow-scroll"><AppointmentDetails date={today}  /></div>
    </div>
  );
} 
