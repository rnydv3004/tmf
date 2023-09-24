import { NextRequest, NextResponse } from "next/server";
import { addDays, getDate, getDay, getHours, getMinutes, isSameDay, parseISO } from 'date-fns';
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.DB_URL,
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();

let availableSlots: (string | number | Date)[] = [];
let holidayList: (string | number | Date)[] = [];

async function readHolidays() {
    try {
        const chatbotRef = ref(db, `holiday`);
        const snapshot = await get(chatbotRef);
        // console.log("Function called")

        if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("Data:",data)
            holidayList = data
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
    
    if (holidayList.indexOf(proposedDate) !== -1) {
        return true
    }

    return false; // Return the updated proposedDate
}

export async function POST(request: NextRequest) {
    
    try {
        await readHolidays()
        const reqBody = await request.json()
        const { checkdate } = reqBody

        // console.log("Check Date in POST:", checkdate)

        if (!checkHoliday(checkdate)) {
            const bookedSlot = await getBookedSlots(checkdate);
            const values = await generateHourlyValues(checkdate);
            const ripeValues = await generateFormattedValues(values)
            // const availableSlots = getAvailableSlots(ripeValues, bookedSlot)

            return NextResponse.json({
                value: ripeValues,
                bookedslots: bookedSlot,
            }, { status: 200 });
        }
        else {
            return NextResponse.json({
                value: [],
                bookedslots: [],
                availableSlots: []
            }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}

function generateHourlyValues(date: string) {

    const gappedValues = [];

    let maxTime, minTime;
    minTime = 10; // 10 am

    if (getDay(new Date(date)) === 5) {
        maxTime = 15; // 3 pm on Saturday
    } else if (getDay(new Date(date)) === 6) {
        minTime = 0
        maxTime = 0; // 3 pm on Saturday
    } else if (getDay(new Date(date)) === 0) {
        minTime = 0
        maxTime = 0; // 3 pm on Saturday
    } else {
        maxTime = 16.5; // 4:30 pm on other days
    }

    if (minTime !== 0 && maxTime !== 0) {
        while (minTime < 12) {

            let minute: any = ((minTime - Math.floor(minTime)) * 60).toFixed(0)

            if (minute % 20 === 0) {
                gappedValues.push(minTime)
                minTime += 20 / 60;
            } else {
                let i: number;
                for (i = 1; i < 20; i++) {
                    minTime += 1 / 60;
                    minute = ((minTime - Math.floor(minTime)) * 60).toFixed(0)
                    if (minute % 20 === 0) {
                        gappedValues.push(minTime)
                        minTime += 20 / 60;
                        break;
                    }
                }
            }
        }

        minTime = 13

        while (minTime < maxTime) {

            let minute: any = ((minTime - Math.floor(minTime)) * 60).toFixed(0)

            if (minute % 20 === 0) {
                gappedValues.push(minTime)
                minTime += 20 / 60;
            } else {
                let i: number;
                for (i = 1; i < 20; i++) {
                    minTime += 1 / 60;
                    minute = ((minTime - Math.floor(minTime)) * 60).toFixed(0)
                    if (minute % 20 === 0) {
                        gappedValues.push(minTime)
                        minTime += 20 / 60;
                        break;
                    }
                }
            }
        }
    }

    return gappedValues;
}

function generateFormattedValues(values: number[]) {
    const resultValues: any = [];
    values.map((time) => {
        let hour = Math.floor(time);
        let minute = ((time - hour) * 60).toFixed(0)
        resultValues.push(`${hour}:${minute === '0' ? '00' : minute}`)
    })

    return resultValues
}

async function getBookedSlots(date: string) {
    const checkDate = date;
    let bookedSlot: (string | number | Date)[] = [];

    try {
        const chatbotRef = ref(db, `bookedslots/${checkDate}`);
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

        return bookedSlot; // Return the updated or empty bookedSlot array
    } catch (error) {
        // console.error("Error reading data:", error);
        throw error;
    }
}

// function getAvailableSlots(ripeValues: any, bookedSlot: (string | number | Date)[]) {

//     let availableSlots = []
//     availableSlots = ripeValues.filter((slot: string) => !(bookedSlot.indexOf(slot) !== -1));
//     return availableSlots

// }
