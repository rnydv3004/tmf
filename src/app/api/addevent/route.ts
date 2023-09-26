import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';

const SCOPES = process.env.SCOPES;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

const calendar2 = google.calendar({
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

        var gEvent = {
            'summary': `Appointment with ${firstName} ${lastName}`,
            'location': 'Google Meet',
            'description': 'Join meeting: https://meet.google.com/fks-hpzs-jwa',
            'start': {
                'dateTime': startTime,

            },
            'end': {
                'dateTime': endTime,

            },
            'attendees': ['taryan3087@gmail.com'],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'email', 'minutes': 4 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };

   

// ---------------------------------

const createGEvent = async (gEvent) => {
  // create client that we can use to communicate with Google 
  const client = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [ // set the right scope
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });


const calendar = google.calendar({ version: 'v3' });

  // We make a request to Google Calendar API.

  try {
    const res = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      auth: client,
      requestBody: gEvent,
    });
    return res.data.htmlLink;
  } catch (error) {
    throw new Error(`Could not create event: ${(error as any).message}`);
  }

}

// --------------------------------




        console.log("Event created!")

        return NextResponse.json({
            message: "Created!"
        }, { status: 200 });

    } catch (error: any) {
        console.log("Error occurred while adding event:", error)
        return NextResponse.json({ error: error.message });

    }

}



