import { NextRequest, NextResponse } from "next/server";

var nodemailer = require("nodemailer");

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { firstName, email, date } = reqBody

        console.log("Sending mail to ", email)
        console.log(`First Name: ${firstName},Email: ${email},Date: ${date}}`)

        const otpText = `Hey ${firstName},

We regret to inform you that your complimentary consultation appointment with our tax professional, originally scheduled for ${date}, has unfortunately been canceled. We understand the importance of your time and apologize for any inconvenience this may cause.
        
Canceled Appointment Details:
        
- Date: ${date}
- Location: Online
        
If you have any questions or need further assistance, please feel free to reach out to our support team at [contact@email.com] or [phone number].
        
Thank you for considering Taxmechanic for your tax-related needs. We appreciate your understanding.
        
Sincerely,
The Taxmechanic Team
        `

        console.log("Hi this is a cancellation mail")
        console.log("Mail From:", process.env.NODEMAILER_EMAIL)

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

