
export async function addSubscription(user: any) {

    try {
    console.log("Hi! Adding subscription...")
    const _body = `{"email": "${user.email}","reactivate_existing": false,"send_welcome_email": false,"utm_source": "WayneEnterprise","utm_campaign": "fall_2022_promotion","utm_medium": "organic","referring_site": "www.wayneenterprise.com/blog","custom_fields": [{"name": "First Name","value": "${user.firstName}"},{"name": "Last Name","value": "${user.lastName}"},{"name": "Phone 1","value": "${user.phone}"}]}`

    const url = 'https://api.beehiiv.com/v2/publications/pub_7472b5fa-5190-4893-a6ee-c6f6a6695c8d/subscriptions';
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer MsKmrKxvyMJVMp87s4cWgG0uUJLlLhmVDcRdsXs6kDG35fRKbKf8UhrvCcgl8HMM'
        },
        body: _body
    };

        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log("Error in adding subscription");
        console.error(error);
    }
}

