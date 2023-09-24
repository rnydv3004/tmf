import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { user, password } = reqBody

        if (user === process.env.USER_DETAILS_ID && password === process.env.USER_PASSWORD) {
            cookies().set({
                name: 'user',
                value: 'true',
                httpOnly: true,
                path: '/',
            })

            return NextResponse.json({ message: "Sign in successfullly!" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Wrong Credentials!" }, { status: 401 })
        }

    } catch (error: any) {
        return
    }
}

export async function GET() {
    try {

        cookies().delete('user')

        return NextResponse.json({ message: "Log out successfullly!" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Some error occured" }, { status: 401 })
    }
}


