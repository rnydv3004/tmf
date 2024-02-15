import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("Adding subscription")
        const reqBody = await request.json()
        const { firstName, lastName, email, phone } = reqBody

        const _body = `{"email": "${email}","reactivate_existing": false,"send_welcome_email": false,"utm_source": "WayneEnterprise","utm_campaign": "fall_2022_promotion","utm_medium": "organic","referring_site": "www.wayneenterprise.com/blog","custom_fields": [{"name": "First Name","value": "${firstName}"},{"name": "Last Name","value": "${lastName}"},{"name": "Phone 1","value": "${phone}"}]}`

        const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB}/subscriptions`;

        // console.log("URL:",url)
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer MsKmrKxvyMJVMp87s4cWgG0uUJLlLhmVDcRdsXs6kDG35fRKbKf8UhrvCcgl8HMM'
            },
            body: _body
          };

        // console.log("Options:",options)

        const response = await fetch(url, options);
        const data = await response.json();
        // console.log(data);
        return NextResponse.json({ message: "Email added" }, { status: 200 })

    } catch (error: any) {
        console.log("Error in adding subscription");
        console.error(error);
        return NextResponse.json({ error: "This is an error:" }, { status: 401 })
    }
}
