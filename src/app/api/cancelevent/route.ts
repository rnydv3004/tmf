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
    SCOPES,
    null, // The email of the user for impersonation (if needed)
    {
        expiresIn: "1d", // Set the token expiration to 1 day
    }
);

const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { eventId } = reqBody;

        const auth = new google.auth.GoogleAuth({
            credentials: {
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
                "universe_domain": "googleapis.com",
                "redirect_uris": ["https://taxmechanic-appointment.vercel.app/api/addevent", "http://localhost:3000/api/addevent", "https://taxmechanic-appointment.vercel.app", "http://localhost:3000"],
                "javascript_origins": ["https://taxmechanic-appointment.vercel.app/api/addevent", "http://localhost:3000/api/addevent", "https://taxmechanic-appointment.vercel.app", "http://localhost:3000"]
            },
            scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar

        });

        const deleteCalendarEvent = async () => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    const authClient = await auth.getClient();
                    const response = await calendar.events.delete({
                        auth: authClient,
                        calendarId: GOOGLE_CALENDAR_ID,
                        eventId: eventId,
                    });
                    console.log("Event canceled successfully.");
                    resolve();
                } catch (error) {
                    console.log("Something went wrong: " + error);
                    reject(error);
                }
            });
        };

        console.log("Canceling event:", deleteCalendarEvent);

        await deleteCalendarEvent(); // Wait for the delete operation to complete

        return NextResponse.json({
            data: "Event Canceled!",
        }, { status: 200 });

    } catch (error: any) {
        console.log("Error occurred while canceling event:", error);
        return NextResponse.json({ error: error.message });
    }
}
