// import { DateTime } from "luxon";
// import { NextRequest, NextResponse } from "next/server";

import { NextRequest, NextResponse } from "next/server";

// const { google } = require('googleapis');

// const SCOPES = process.env.SCOPES;
// const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
// const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
// const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
// const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

// const jwtClient = new google.auth.JWT(
//     GOOGLE_CLIENT_EMAIL,
//     null,
//     GOOGLE_PRIVATE_KEY,
//     SCOPES
// );

// const calendar = google.calendar({
//     version: 'v3',
//     project: GOOGLE_PROJECT_NUMBER,
//     auth: jwtClient
// });

// export async function POST(request: NextRequest) {

//     try {
//         const reqBody = await request.json()
//         const { firstName, lastName, date, time } = reqBody

//         const dateTime = DateTime.fromISO(`${date}T${time}`, { zone: 'America/Toronto' });

//         console.log(dateTime.toString()); // Print the DateTime object

//         const startTime = dateTime.toUTC()
//         const endTime = startTime.plus({ minutes: 20 })

//         // console.log("Start date:", startTime)
//         // console.log("Start date:", endTime)

//         var event = {
//             'summary': `Appointment with ${firstName} ${lastName}`,
//             'location': 'Google Meet',
//             'description': 'Join meeting: https://meet.google.com/fks-hpzs-jwa',
//             'start': {
//                 'dateTime': startTime,

//             },
//             'end': {
//                 'dateTime': endTime,

//             },
//             'attendees': [''],
//             'reminders': {
//                 'useDefault': false,
//                 'overrides': [
//                     { 'method': 'email', 'minutes': 24 * 60 },
//                     { 'method': 'email', 'minutes': 4 * 60 },
//                     { 'method': 'popup', 'minutes': 10 },
//                 ],
//             },
//         };

//         const auth = new google.auth.GoogleAuth({
//             credentials: {
//                 "type": "service_account",
//                 "project_id": "avid-day-281003",
//                 "private_key_id": process.env.PRIVATE_KEY_ID,
//                 "private_key": process.env.GOOGLE_PRIVATE_KEY,
//                 "client_email": "calender-key@avid-day-281003.iam.gserviceaccount.com",
//                 "client_id": process.env.CLIENT_ID,
//                 "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//                 "token_uri": "https://oauth2.googleapis.com/token",
//                 "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//                 "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/calender-key%40avid-day-281003.iam.gserviceaccount.com",
//                 "universe_domain": "googleapis.com"
//               },
//             scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar
//         });

//         console.log("Auth successfully!", auth)

//         auth.getClient().then((a: any) => {
//             calendar.events.insert({
//                 auth: a,
//                 calendarId: GOOGLE_CALENDAR_ID,
//                 resource: event,
//             }).then((response: any) => {
//                 console.log("Response:", response.data);
//                 return NextResponse.json({ message: "Event created successfully!" }, { status: 200 });
//             }).catch((err: any) => {
//                 console.error("Error:", err);
//                 return NextResponse.json({ error: err.message },{ status: 401});
//             });
//         });

//         console.log("Event created!")

//         return NextResponse.json({
//             message: "Created!"
//         }, { status: 200 });

//     } catch (error: any) {
//         console.log("Error occurred while adding event:",error)
//         return NextResponse.json({ error: error.message });

//     }

// }

const { google } = require('googleapis');

// Load the service account credentials from the JSON file
// const key = require('./path-to-your-service-account-key.json');


export async function POST(request: NextRequest) {

    try {

        const reqBody = await request.json()
        const { firstName, lastName, date, time } = reqBody


        const key = {
            "type": "service_account",
            "project_id": "avid-day-281003",
            "private_key_id": process.env.PRIVATE_KEY_ID,
            "private_key": process.env.GOOGLE_PRIVATE_KEY,
            "client_email": "calender-key@avid-day-281003.iam.gserviceaccount.com",
            "client_id": process.env.CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/calender-key%40avid-day-281003.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        }

        // Create an OAuth2 client with the service account credentials
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/calendar']
        );

        // Authorize the client and make API requests
        jwtClient.authorize((err: any, tokens: any) => {
            if (err) {
                console.error('Authorization error:', err);
                return;
            }

            const calendar = google.calendar('v3');

            // Define the event details
            const event = {
                summary: 'Sample Event',
                description: 'This is a sample event description.',
                start: {
                    dateTime: '2023-09-30T10:00:00',
                    timeZone: 'America/Toronto'
                },
                end: {
                    dateTime: '2023-09-30T12:00:20',
                    timeZone: 'America/Toronto'
                },
            };

            // Insert the event into the calendar
            calendar.events.insert({
                auth: jwtClient,
                calendarId: process.env.GOOGLE_CALENDAR_ID, // Use 'primary' for the primary calendar or the calendar ID you want to add the event to.
                resource: event,
            }, (err: any, res: { data: any; }) => {
                if (err) {
                    console.error('Error adding event:', err);
                    return;
                }
                console.log('Event added:', res.data);
            });
        });


        return NextResponse.json({ message: "Hi" }, { status: 201 });

    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

}