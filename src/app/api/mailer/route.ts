import { NextRequest, NextResponse } from "next/server";

var nodemailer = require("nodemailer");

export async function sendMail(subject: any, toEmail: any, otpText: any) {

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PW,
        },
    });

    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: toEmail,
        subject: "Taxmechanic Appointment Confirmation",
        text: otpText,
    };

    transporter.sendMail(mailOptions, function (error: string | undefined, info: any) {
        if (error) {
            throw new Error(error);
        } else {
            // console.log("Email Sent");
            return true;
        }
    });
}


export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { lastName, email, date, time } = reqBody

        const otpText = `Dear Mr./Ms. ${lastName},

We would like to inform you that a complimentary consultation appointment has been scheduled with one of our tax professionals at ${date} at ${time}. The meeting will take place online, and you can access the meeting link provided below. We appreciate your appointment booking.
        
Appointment Details:
        
Date: ${date}
Time: ${time}
Location: Online
Meeting Link: https://meet.google.com/fks-hpzs-jwa

Thank you for choosing Taxmechanic for your tax-related needs.
        
Sincerely,
The Taxmechanic Team`

        sendMail("Taxmechanic Appointment Confirmation", email, otpText)

        return NextResponse.json({
            message: "Email sent!",
            status: 200
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}

