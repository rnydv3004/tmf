import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'time', headerName: 'Time', width: 130 },
    { field: 'phone', headerName: 'Phone', type: 'phone', width: 130 },
    { field: 'email', headerName: 'Email', description: 'Email', type: 'email', sortable: true, width: 400 }
];

// const rows = [
//     { id: 1, lastName: 'One', firstName: 'One', phone: 7678319417, email: 'yaryan3087@gmail.com', date: '2023-09-22', time: '11:05' },
// ];

export default function AppointmentDetails(props: any) {

    // console.log("Appointment details:", props.details)

    return (
        <>
            {props.details !== '' ? (<div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={props.details}
                    columns={columns}
                />
            </div>) : (
                <div className='w-full h-full flex justify-center items-center'>
                    <div className="loader"></div>
                </div>)}
        </>
    );
}