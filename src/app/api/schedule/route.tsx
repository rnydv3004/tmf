import { NextRequest, NextResponse } from "next/server";
var nodemailer = require("nodemailer");
import { DateTime, Duration } from "luxon";
const schedule = require('node-schedule');

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { firstName, email, date, clienttime, time } = reqBody

        // "America/Toronto" time in date format
        const appointmentDateTimeTornoto = DateTime.fromFormat(
            `${date} ${time}`,
            'yyyy-MM-dd HH:mm',
            { zone: "America/Toronto" }
        );

        console.log("Appointment Toronto time:", appointmentDateTimeTornoto)

        // Time in server time zone
        const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('Server Time Zone:', serverTimeZone);

        const appointmentDateTimeServer = appointmentDateTimeTornoto.setZone(serverTimeZone);  // appointment time (server)
        const currentServerTime = DateTime.now().setZone(serverTimeZone)  // current time (server)

        const timeDifference = appointmentDateTimeServer.diff(currentServerTime);   // diff btwn appointmnet and current time (server both)    
        const twentyFourHours = Duration.fromObject({ hours: 20 });  // Create a Luxon Duration representing 20 hours

        console.log("Time difference:",timeDifference.as('milliseconds'))
        console.log("Twenty Hours:",twentyFourHours.as('milliseconds'))

        // Compare the time difference with 20 hours
        if (timeDifference >= twentyFourHours) {

            const oneDayBefore = appointmentDateTimeServer.minus({ hours: 20 })
            console.log("Schedule reminder mail for One day before:", oneDayBefore)

            const job1 = schedule.scheduleJob(oneDayBefore.toJSDate(), function () {
                mailOneDayBefore(firstName, email, date, clienttime, time, 1)
            });
        }

        // 4 huour before time of appointment
        const _4hoursBefore = appointmentDateTimeServer.minus({ hours: 4 })
        console.log("Schedule reminder mail for 4 hours before:", _4hoursBefore)

        const job2 = schedule.scheduleJob(_4hoursBefore.toJSDate(), function () {
            mailOneDayBefore(firstName, email, date, clienttime, time, 0)
        });

        console.log("Staus:",job2.status)

        return NextResponse.json({
            message: "Appointment Booked Successfully!",
            status: 200,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message });
    }
}


async function mailOneDayBefore(firstName: any, email: any, date: any, clienttime: any, time: any, timeLeft: number) {
    const otpText = `Hello ${firstName},

We hope this message finds you well. We want to remind you about your upcoming consultation appointment with one of our tax professionals.
    
**Appointment Reminder Details:**
    
Date: ${date}
Time: ${clienttime} (${time} EST)
Location: Online
Meeting Link: [Click Here to Join the Meeting](https://meet.google.com/fks-hpzs-jwa)
    
We value your time and are committed to providing you with top-notch service. Please make sure you are prepared for the meeting, and if you have any specific questions or documents you'd like to discuss, feel free to prepare them in advance.
    
If, for any reason, you need to reschedule or cancel the appointment, please let us know as soon as possible by replying to this email or contacting our customer support.
    
We appreciate your trust in Taxmechanic, and we look forward to assisting you with your tax-related needs. If you have any last-minute questions or concerns, please don't hesitate to reach out.
    
Thank you for choosing Taxmechanic, and we'll see you at the scheduled consultation.
    
Sincerely,
The Taxmechanic Team
`

    var transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PW,
        },
    });

    var mailSubject = `Reminder: Free Appointment with Taxmechanic ${timeLeft === 1 ? "Tomorrow" : "in 4 hours"}`

    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        bcc: process.env.NODEMAILER_EMAIL,
        subject: mailSubject,
        text: otpText,
    };

    console.log("Mailoption set successfully!")

    const sendStatus = await transporter.sendMail(mailOptions);

    if (sendStatus.accepted.length > 0) {
        console.log("Email Sent to ", email);
        return NextResponse.json({
            message: "Email sent!",
            status: 200,
        });
    } else {
        console.error("Email not accepted for delivery.");
        throw new Error("Email not accepted for delivery.");
    }
}