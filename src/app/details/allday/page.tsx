'use client'
import React, { useEffect, useState } from 'react';
import AppointmentDetails from '@/components/AppointmentDetails';
import { DateTime } from 'luxon';

export default function Page() {

    const [transformedData, setTransformmedData]: any = useState('')

    // console.log("Today is:", today);
    fetch('http://localhost:3000/api/getdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({
            "date": ''
        })
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Error fetching data. Status: ${response.status}`);
            }

            const resdata = await response.json();
            // console.log("The data is:", resdata.data);

            // Convert the input data into the desired format
            let transformedDataTemp: {
                id: any; // Incremental unique ID
                lastName: any; firstName: any; phone: number; // Convert phone to a number
                email: any; date: any; time: any;
            }[] = [];

            // Iterate through the nested objects and reformat them
            Object.entries(resdata.data).forEach(([date, dateData]:[any, any]) => {
                Object.entries(dateData).forEach(([phone, details]:[string,any]) => {
                    // console.log('Data in second loop is:',details)
                    transformedDataTemp.push({
                        id: transformedDataTemp.length + 1, // Incremental unique ID
                        lastName: details.lastName,
                        firstName: details.fullName,
                        phone: parseInt(phone, 10), // Convert phone to a number
                        email: details.email || '',
                        date: date || '',                        
                        time: details.time || ''
                    });
                });
            });

            // console.log("Transformed data:", transformedDataTemp);

            // Ensure that setTransformedData is correctly defined and updates the state

            setTransformmedData(transformedDataTemp);
            // console.log("After setting state");
            // console.log("Transformed data in state:", transformedData);
        })
        .catch((error) => {
            console.error("Error:", error);
        });


    return (
        <div className='flex flex-col gap-2 h-[calc(100vh-4rem)] w-full bg-white p-2'>
            <div className='h-full w-full flex overflow-scroll'><AppointmentDetails date={''} details={transformedData} /></div>
        </div>
    );
}
