/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  env: {
    NODEMAILER_EMAIL: "sunny@taxmechanic.ca",
    NODEMAILER_PW: "fwlx zgby zkzs tpbo",
    DB_URL: "https://appointments-b9eae-default-rtdb.firebaseio.com/",
    USER_DETAILS_ID: 'admin',
    USER_PASSWORD: "Admin24680#",
    BEEHIIV_API: 'MsKmrKxvyMJVMp87s4cWgG0uUJLlLhmVDcRdsXs6kDG35fRKbKf8UhrvCcgl8HM',
    BEEHIVE_PUB: 'pub_7472b5fa-5190-4893-a6ee-c6f6a6695c8d'
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
