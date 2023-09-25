import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";


const { google } = require('googleapis');

const SCOPES = process.env.SCOPES;
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxeQPYALdwDk3J\nyI+VLgSK5oZ2JD5Vkhbs6TmRgKJX1AThfx8suKeIr4D/xJ1Y0j5JLp53i9temJEA\n/0ZPBAXYIkA5F5o+ifvgmUMlb7uuUWiyyF0ZBBey2kWJYH1TzVVIOtLgVqajc2Pe\nkUpoW6fgREmCd3qIl3goxCkt3Iz071pu6P7cJDy23lRVK1asg3hqh1SgBHrX+Vb8\n7zky03FGLdXmtD+D9WVf6cdOX59fzsSBeGXVblYJ/jPbqbl4cCGwS6f1hUqSyClP\nzElLC2gNGIGJeHDXDTjwCU/slu2dC8KK+NnwLHQr4Pj13ROx2gSQKG8xCsh+iz03\nNgrLpMA9AgMBAAECggEAFD6fll/1ASWJ2wWAGDM7+UM7ebMvMLBnUKR7CZpdwfxK\nDnfAbtjqXtjL+WWMBZLW2v7YFVC56xPicFF2nRBKxyST+tViPqUF434l9YEJHKPB\nod+PgpXnwLxxAQQAbeK0qDIaVOme3exCLrpCoT4x9Gj1OsV2lfYRAmXzx98KSEyR\nONqV023g9XzHxWbUl2l7c8RvIFNN7MY68Lo7z/bXm4rdIykE7stRoq0BVcnsB2ez\n/B9Rx6zQ5bxDS6C/wBOHJiu4bs2GcmVFAZraOTfj0/ChLj+qmJZ+NplBoiy65xK4\nJn69VqxhFIz9SvAFcfCtFl6lX9zo5C2U2DtE3SMOpwKBgQD6wvEvTNJlnXlsx2mT\nio4uhXGNZWmf+vAUOcOCILpxZNCnG4mWVhj9GqlGrJVjJyShVamky6bSZWgHt4yI\ngEtPDZwHCU/ZAQc2BwEyBgFg2UGk4lho1IB6Wjlh+NRlncPtH4nNb8wXIp3eXs7F\nlvWFEL1fns8tfTErDxkLu3JrYwKBgQD2hGWkpdxXHfjqVz1NJnliKF6JY6Hm519U\nYEtZaVWE7eYJ3kkOzhpC81Yq0ay0UgXtyObet7P3Kl5CsluDid7sme7Ndq6qHMwu\n/3bKY7b5xMQOcS28kMqI6CpCusi/Z4BW45OVsiBnbfG893yeAx/+qyhCfvQrBGem\nxU89zciH3wKBgFUJ4SLqSXueYLxMD/iyBy+tn2mVF7HiNqKVSEEL+k5UIxJYm1s5\nTXYgIYHPK0YZ0ylHVKWHTsaRDyt2ypjL8T4Y3m3gcYyk9Z4T2Arv0G3Yn5NcEyFR\n11Qm3sjjypu/Wd9DT8c0f6Dk42ay/iox3IdIuv//akEB8LeqghLheZcDAoGBAJjF\n7lP+cjIPIh7gl94DNQCO8h+E/mYiB6M71haAP/6UjJabCn3BXucU9NaugLBzkLcP\nZXyrLj3EJQyCilJXlC7fKu5sWcyU8jlCGrVM3K2nsrUckPKmbM4xy1b1eMmd9Bxl\nByajcI+IxGKOoc0vNJnYKqgjE2DBZxckenpb2KXTAoGBAJGE8OwSVDUlPlGj1pdZ\nhmwskbMJSi/IlZv+gZvP4GoZs0DqNwwoHCTIGIrlADQQF5edicJ28CVQBDyQPbB6\nmsGatE5ATJqN+9k5LuqPiGI1m/9p7+Ir44snupzoOM+FfqBszQxkp7Y36s4CYua4\n/rCFK650ocKYHcj3F1NZQ4bw\n-----END PRIVATE KEY-----\n"
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
            credentials: {
                "type": "service_account",
                "project_id": "avid-day-281003",
                "private_key_id": process.env.PRIVATE_KEY_ID,
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxeQPYALdwDk3J\nyI+VLgSK5oZ2JD5Vkhbs6TmRgKJX1AThfx8suKeIr4D/xJ1Y0j5JLp53i9temJEA\n/0ZPBAXYIkA5F5o+ifvgmUMlb7uuUWiyyF0ZBBey2kWJYH1TzVVIOtLgVqajc2Pe\nkUpoW6fgREmCd3qIl3goxCkt3Iz071pu6P7cJDy23lRVK1asg3hqh1SgBHrX+Vb8\n7zky03FGLdXmtD+D9WVf6cdOX59fzsSBeGXVblYJ/jPbqbl4cCGwS6f1hUqSyClP\nzElLC2gNGIGJeHDXDTjwCU/slu2dC8KK+NnwLHQr4Pj13ROx2gSQKG8xCsh+iz03\nNgrLpMA9AgMBAAECggEAFD6fll/1ASWJ2wWAGDM7+UM7ebMvMLBnUKR7CZpdwfxK\nDnfAbtjqXtjL+WWMBZLW2v7YFVC56xPicFF2nRBKxyST+tViPqUF434l9YEJHKPB\nod+PgpXnwLxxAQQAbeK0qDIaVOme3exCLrpCoT4x9Gj1OsV2lfYRAmXzx98KSEyR\nONqV023g9XzHxWbUl2l7c8RvIFNN7MY68Lo7z/bXm4rdIykE7stRoq0BVcnsB2ez\n/B9Rx6zQ5bxDS6C/wBOHJiu4bs2GcmVFAZraOTfj0/ChLj+qmJZ+NplBoiy65xK4\nJn69VqxhFIz9SvAFcfCtFl6lX9zo5C2U2DtE3SMOpwKBgQD6wvEvTNJlnXlsx2mT\nio4uhXGNZWmf+vAUOcOCILpxZNCnG4mWVhj9GqlGrJVjJyShVamky6bSZWgHt4yI\ngEtPDZwHCU/ZAQc2BwEyBgFg2UGk4lho1IB6Wjlh+NRlncPtH4nNb8wXIp3eXs7F\nlvWFEL1fns8tfTErDxkLu3JrYwKBgQD2hGWkpdxXHfjqVz1NJnliKF6JY6Hm519U\nYEtZaVWE7eYJ3kkOzhpC81Yq0ay0UgXtyObet7P3Kl5CsluDid7sme7Ndq6qHMwu\n/3bKY7b5xMQOcS28kMqI6CpCusi/Z4BW45OVsiBnbfG893yeAx/+qyhCfvQrBGem\nxU89zciH3wKBgFUJ4SLqSXueYLxMD/iyBy+tn2mVF7HiNqKVSEEL+k5UIxJYm1s5\nTXYgIYHPK0YZ0ylHVKWHTsaRDyt2ypjL8T4Y3m3gcYyk9Z4T2Arv0G3Yn5NcEyFR\n11Qm3sjjypu/Wd9DT8c0f6Dk42ay/iox3IdIuv//akEB8LeqghLheZcDAoGBAJjF\n7lP+cjIPIh7gl94DNQCO8h+E/mYiB6M71haAP/6UjJabCn3BXucU9NaugLBzkLcP\nZXyrLj3EJQyCilJXlC7fKu5sWcyU8jlCGrVM3K2nsrUckPKmbM4xy1b1eMmd9Bxl\nByajcI+IxGKOoc0vNJnYKqgjE2DBZxckenpb2KXTAoGBAJGE8OwSVDUlPlGj1pdZ\nhmwskbMJSi/IlZv+gZvP4GoZs0DqNwwoHCTIGIrlADQQF5edicJ28CVQBDyQPbB6\nmsGatE5ATJqN+9k5LuqPiGI1m/9p7+Ir44snupzoOM+FfqBszQxkp7Y36s4CYua4\n/rCFK650ocKYHcj3F1NZQ4bw\n-----END PRIVATE KEY-----\n",
                "client_email": "calender-key@avid-day-281003.iam.gserviceaccount.com",
                "client_id": process.env.CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/calender-key%40avid-day-281003.iam.gserviceaccount.com",
                "universe_domain": "googleapis.com"
              },
            scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar
        });

        console.log("Auth successfully!", auth)

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
                return NextResponse.json({ error: err.message },{ status: 401});
            });
        });

        console.log("Event created!")

        return NextResponse.json({
            message: "Created!"
        }, { status: 200 });

    } catch (error: any) {
        console.log("Error occurred while adding event:",error)
        return NextResponse.json({ error: error.message });

    }

}



