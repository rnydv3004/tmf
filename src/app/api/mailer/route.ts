import { NextRequest, NextResponse } from "next/server";

var nodemailer = require("nodemailer");

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { firstName, email, date, time } = reqBody

        console.log("Sending mail to ", email)
        console.log(`First Name: ${firstName},Email: ${email},Date: ${date},Time: ${time}`)

        const otpText = `Hey ${firstName}


We would like to inform you that a complimentary consultation appointment has been scheduled with one of our tax professionals at ${date} at ${time}. The meeting will take place online, and you can access the meeting link provided below. We appreciate your appointment booking.
        
Appointment Details:
        
Date: ${date}
Time: ${time}
Location: Online
Meeting Link: https://meet.google.com/fks-hpzs-jwa

Thank you for choosing Taxmechanic for your tax-related needs.
        
Sincerely,
The Taxmechanic Team`

        console.log("Hi this is a mail")

        var transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PW,
            },
        });

        var mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            bcc: process.env.NODEMAILER_EMAIL,
            subject: "Taxmechanic Appointment Confirmation",
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

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}

