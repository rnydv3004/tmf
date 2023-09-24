import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

const { google } = require('googleapis');

const SCOPES = process.env.SCOPES;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { firstName, lastName, date, time } = reqBody

        const dateTime = DateTime.fromISO(`${date}T${time}`, { zone: 'America/Toronto' });

        console.log(dateTime.toString()); // Print the DateTime object

        const startTime = dateTime.toUTC()
        const endTime = startTime.plus({ minutes: 20 })

        // console.log("Start date:", startTime)
        // console.log("Start date:", endTime)

        var event = {
            'summary': `Appointment with ${firstName} ${lastName}`,
            'location': 'Google Meet',
            'description': 'Join meeting: https://meet.google.com/fks-hpzs-jwa',
            'start': {
                'dateTime': startTime,
                
            },
            'end': {
                'dateTime': endTime,
            
            },
            'attendees': [''],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'email', 'minutes': 4 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };

        const auth = new google.auth.GoogleAuth({
            keyFile: 'avid-day-281003-fa0ab3903368.json',
            scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar
        });

        auth.getClient().then((a: any) => {
            calendar.events.insert({
                auth: a,
                calendarId: GOOGLE_CALENDAR_ID,
                resource: event,
            }).then((response: any) => {
                console.log("Response:", response.data);
                return NextResponse.json({ message: "Event created successfully!" }, { status: 200 });
            }).catch((err: any) => {
                console.error("Error:", err);
                return NextResponse.json({ error: err.message });
            });
        });


        return NextResponse.json({
            message: "Created!"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });

    }

}

