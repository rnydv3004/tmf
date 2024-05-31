import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.DB_URL,
};

const fbApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();

export async function POST(request: NextRequest) {
    try {
        const { reference, field, value } = await request.json();
        const appointmentRef = ref(db, `appointments/${reference}`);
        const updateData = { [field]: value};

        await update(appointmentRef, updateData);

        return NextResponse.json({ data: "Updated Successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json({ error: "Some issue occurred" }, { status: 500 });
    }
}
