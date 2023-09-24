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

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { date } = reqBody

       
        let details: (string | number | Date)[] = []
        
        // console.log("GetDate date:", date)

        const chatbotRef = ref(db, `appointments/${date}`);
        const snapshot = await get(chatbotRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            details = data;
            
        } else {
            details = []
        }

        // console.log("details",details)
        return NextResponse.json({ data: details },{status: 200});

    } catch (error: any) {
        console.log("Error in fetching data:",error.message)
        return NextResponse.json({ error: error.message });
    }
}

