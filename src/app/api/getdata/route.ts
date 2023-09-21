import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.DB_URL,
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();

let appointmentDetails: (string | number | Date)[] = [];

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { checkdate } = reqBody

        console.log("Check Date in POST:", checkdate)

        const appointmentDetails = await getDetails(checkdate);
        // const initialDate = new Date(); // Replace this with your initial date

        return NextResponse.json({
            details: appointmentDetails
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}

async function getDetails(date: any) {

    const checkDate = date;
    let details: (string | number | Date)[] = [];

    try {

        const chatbotRef = ref(db, `appointments/${checkDate}`);
        const snapshot = await get(chatbotRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            details = data;
        } else {
            details = [];
        }

        // console.log("Deatils:",details)

        return details; // Return the updated or empty bookedSlot array

    } catch (error) {
        throw error
    }
}
