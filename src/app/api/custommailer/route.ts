import { NextRequest, NextResponse } from "next/server";

var nodemailer = require("nodemailer");

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { firstName, email, message } = reqBody

        console.log("Sending mail to ", email)
        console.log(`First Name: ${firstName},Email: ${email}`)

        const otpText = message

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
            subject: "Taxmechanic",
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

