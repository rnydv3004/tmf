import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'time', headerName: 'Time', width: 130 },
    {
        field: 'phone',
        headerName: 'Phone',
        type: 'phone',
        width: 130,
    },
    {
        field: 'email',
        headerName: 'Email',
        description: 'Email',
        type: 'email',
        sortable: true,
        width: 400
    }

];

const rows = [
    { id: 1, lastName: 'One', firstName: 'One', phone: 7678319417, email: 'yaryan3087@gmail.com', date: '2023-09-22', time: '11:05' },
    { id: 2, lastName: 'Two', firstName: 'Two', age: 42 },
    { id: 3, lastName: 'Thirteen', firstName: 'Three', age: 45 },
    { id: 4, lastName: 'Four', firstName: 'Four', age: 16 },
    { id: 5, lastName: 'Five', firstName: 'Five', age: null },
    { id: 6, lastName: 'Six', firstName: 'Six', age: 150 },
    { id: 7, lastName: 'Seven', firstName: 'Seven', age: 44 },
    { id: 8, lastName: 'Eight', firstName: 'Eight', age: 36 },
    { id: 9, lastName: 'Nine', firstName: 'Nine', age: 65 },
    { id: 10, lastName: 'Ten', firstName: 'Ten', age: 150 },
    { id: 11, lastName: 'Eleven', firstName: 'Eleven', age: 44 },
    { id: 12, lastName: 'Twelve', firstName: 'Twelve', age: 36 },
    { id: 13, lastName: 'Thirteen', firstName: 'Thirteen', age: 65 },

];

export default function AppointmentDetails(props: any) {

    useEffect(() => {
        getData(props.date)
    }, [])


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
            />
        </div>
    );
}

async function getData(date: any) {

    try {

        const reqData = {
            checkdate : date
        }

        const response = await fetch('/api/getdata', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(reqData), // Convert the object to JSON and set it as the body
        });
        
        console.log("Reached")
        if (!response.ok) {
            throw new Error(`Error fetching data. Status: ${response.status}`);
        }


        const data = await response.json(); // Parse the response JSON data
        console.log("Retrieved Data:",data)

    } catch (error) {
        throw new Error('Function not implemented.');
    }

}

