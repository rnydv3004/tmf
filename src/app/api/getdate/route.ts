import { NextResponse } from "next/server";
import { addDays, format, getDay, isSameDay } from 'date-fns';
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";
import { parseISO } from "date-fns/esm";

const firebaseConfig = {
    databaseURL: process.env.DB_URL,
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();
let holidayList: (string | number | Date)[]=[];

async function readHolidays() {
    try {
        const chatbotRef = ref(db);
        const snapshot = await get(chatbotRef);
        // console.log("Function called")

        if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("Data:",data)
            holidayList = data.holiday
            return // Return the data
        } else {
            // console.log("Data: null")
            return null; // Return null if no data is available
        }
    } catch (error) {
        // console.error("Error reading data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}


function checkHoliday(date: any): any {

    let proposedDate = date;
    // console.log("Proposed date in checkholiday:",proposedDate)
    
    if (holidayList.indexOf(proposedDate) !== -1) {
        // console.log("This date has a holiday");
        proposedDate = format(addDays(parseISO(proposedDate), 1), 'yyyy-MM-dd');
        // console.log("New proposed date after holiday check: ", proposedDate);
        // Recursively call checkHoliday and update proposedDate
        proposedDate = checkHoliday(proposedDate);
        // Now, check for weekend
        proposedDate = checkWeekend(proposedDate);
    } 
    // else {
    //     // console.log("No Holiday", proposedDate);
    // }

    return proposedDate; // Return the updated proposedDate
}

function checkWeekend(date: any) {

    let proposedDate = date;

    // console.log("Proposed date in checkWeekend:",proposedDate)

    const day = proposedDate

    if (getDay(parseISO(day)) === 0) {
        proposedDate = format(addDays(parseISO(proposedDate), 1), 'yyyy-MM-dd');;
        // Recursively call checkWeekend and update proposedDate
        proposedDate = checkWeekend(proposedDate);
        // Now, check for holiday
        proposedDate = checkHoliday(proposedDate);
    }
    else if (getDay(parseISO(day)) === 6) {
        proposedDate = format(addDays(parseISO(proposedDate), 2), 'yyyy-MM-dd');;
        // Recursively call checkWeekend and update proposedDate
        proposedDate = checkWeekend(proposedDate);
        // Now, check for holiday
        proposedDate = checkHoliday(proposedDate);
    }
    // else {
    //     console.log("No Weekend", proposedDate);
    // }

    return proposedDate; // Return the updated proposedDate
}

export async function GET() {
    try {
        await readHolidays()
        // console.log("holidays:", holiday)

        // checkdates()
        const today = format(addDays(new Date(),1), 'yyyy-MM-dd');
        let day1 = checkHoliday(today);
        day1 = checkWeekend(day1)
        const day1formatted = parseISO(day1)
        let day2 = checkHoliday(format(addDays(day1formatted,1), 'yyyy-MM-dd'));
        day2 = checkWeekend(day2)

        return NextResponse.json({
            first: day1,
            second: day2,
            today: today,
            holidaysfb: holidayList
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
