import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";


const firebaseConfig = {
    databaseURL: process.env.DB_URL,
};

const fbApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase()

async function updateBookingTime(dateReq: string, timeReq: string) {

    try {
        let bookedSlot: any;
        const chatbotRef = ref(db, `bookedslots/${dateReq}`);
        const snapshot = await get(chatbotRef);
        // console.log("Function called");

        if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("Data:", data);
            bookedSlot = data;
            // console.log("Booked Slots:", bookedSlot);
        } else {
            // console.log("Data: null");
            // Return an empty array if no data is available
            bookedSlot = [];
        }

        bookedSlot = bookedSlot.slice(0, -1) + ',' + '\'' + timeReq + '\'' + ']'

        // bookedSlot
        // console.log("Booked slot:",bookedSlot)

        set(ref(db, `bookedslots/${dateReq}`), bookedSlot);


    } catch (error) {
        // console.error("Error reading data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

async function saveData(fullNameReq: string, lastNameReq: string, typeReq: string, emailReq: string, phoneReq: string, messageReq: string, dateReq: string, timeReq: string, eventId: string) {

    try {
        // Initialize Firebase
        set(ref(db, `appointments/${dateReq}/${phoneReq}`), {
            fullName: fullNameReq,
            lastName: lastNameReq,
            type: typeReq,
            email: emailReq,
            phone: phoneReq,
            message: messageReq,
            date: dateReq,
            time: timeReq,
            eventId: eventId
        });

        updateBookingTime(dateReq, timeReq)

    } catch (error) {
        // console.error("Error reading data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { firstName, lastName, type, email, phone, message, date, time, eventId } = reqBody

        saveData(firstName, lastName, type, email, phone, message, date, time, eventId)



        return NextResponse.json({
            message: "Appointment Booked Successfully!",
            status: 200
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}


export async function GET() {
    try {

        return NextResponse.json({
            message: "Hi This is Taxmechanic!"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}



