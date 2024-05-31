import { NextRequest, NextResponse } from "next/server";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

var nodemailer = require("nodemailer");

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { firstName, email, date, clienttime, time } = reqBody

        console.log("Sending mail to ", email)
        // console.log(`First Name: ${firstName},Email: ${email},Date: ${date},Time: ${clienttime}`)

        const inputDateTimeString = `${date} ${time}`;
        const inputTimeZone = 'America/New_York'; // Eastern Time (ET)

        // Parse the input date and time in Eastern Time (ET)
        const inputDateTime = dayjs.tz(inputDateTimeString, inputTimeZone);

        // Convert to Mountain Standard Time (MST)
        const mstTime = inputDateTime.tz('America/Denver').format('HH:mm');

        // Convert to Pacific Standard Time (PST)
        const pstTime = inputDateTime.tz('America/Los_Angeles').format('HH:mm');

        const otpText = `Dear ${firstName},

We are pleased to inform you that a complimentary consultation appointment has been arranged with our tax professionals for ${date}, at ${time} EST. The meeting will be conducted online for your convenience.

Please find the details below:

Appointment Details:

Date: ${date}
Time: ${clienttime} - ${time} EST/${mstTime} MST/${pstTime} PST
Location: Online
Meeting Link: https://meet.google.com/fks-hpzs-jwa

We greatly appreciate your appointment booking and look forward to assisting you with your tax-related inquiries.

Should you have any questions or need further assistance, please do not hesitate to contact us at 437-353-9992.

Best regards,

Sunny Singh
Tax Consultant`

        console.log("Hi this is a mail")

        try {
            var transporter = await nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: 'kktq xplf ofci lelw',
                },
            });

            var mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                bcc: process.env.NODEMAILER_EMAIL,
                subject: "Confirmation of Tax Mechanic Consultation Appointment",
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

        } catch (error) {
            console.error('Error sending email:', error);

        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}

