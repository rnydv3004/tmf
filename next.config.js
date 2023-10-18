/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  env: {
    NODEMAILER_EMAIL: "taryan3087@gmail.com",
    SPREADSHEET_ID: '1bhTNq-8KAr2AOwnEOCsLafqmhQHC4USycpA221ktFus',
    NODEMAILER_PW: "ruaa azyh hwyp awsm",
    DB_URL: "https://appointments-b9eae-default-rtdb.firebaseio.com/",
    USER_DETAILS_ID: "admin",
    USER_PASSWORD: "Admin24680#",
    BEEHIIV_API: "MsKmrKxvyMJVMp87s4cWgG0uUJLlLhmVDcRdsXs6kDG35fRKbKf8UhrvCcgl8HM",
    BEEHIIV_PUB: "pub_7472b5fa-5190-4893-a6ee-c6f6a6695c8d",
    SCOPES: "https://www.googleapis.com/auth/calendar",
    GOOGLE_PRIVATE_KEY:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxeQPYALdwDk3J\nyI+VLgSK5oZ2JD5Vkhbs6TmRgKJX1AThfx8suKeIr4D/xJ1Y0j5JLp53i9temJEA\n/0ZPBAXYIkA5F5o+ifvgmUMlb7uuUWiyyF0ZBBey2kWJYH1TzVVIOtLgVqajc2Pe\nkUpoW6fgREmCd3qIl3goxCkt3Iz071pu6P7cJDy23lRVK1asg3hqh1SgBHrX+Vb8\n7zky03FGLdXmtD+D9WVf6cdOX59fzsSBeGXVblYJ/jPbqbl4cCGwS6f1hUqSyClP\nzElLC2gNGIGJeHDXDTjwCU/slu2dC8KK+NnwLHQr4Pj13ROx2gSQKG8xCsh+iz03\nNgrLpMA9AgMBAAECggEAFD6fll/1ASWJ2wWAGDM7+UM7ebMvMLBnUKR7CZpdwfxK\nDnfAbtjqXtjL+WWMBZLW2v7YFVC56xPicFF2nRBKxyST+tViPqUF434l9YEJHKPB\nod+PgpXnwLxxAQQAbeK0qDIaVOme3exCLrpCoT4x9Gj1OsV2lfYRAmXzx98KSEyR\nONqV023g9XzHxWbUl2l7c8RvIFNN7MY68Lo7z/bXm4rdIykE7stRoq0BVcnsB2ez\n/B9Rx6zQ5bxDS6C/wBOHJiu4bs2GcmVFAZraOTfj0/ChLj+qmJZ+NplBoiy65xK4\nJn69VqxhFIz9SvAFcfCtFl6lX9zo5C2U2DtE3SMOpwKBgQD6wvEvTNJlnXlsx2mT\nio4uhXGNZWmf+vAUOcOCILpxZNCnG4mWVhj9GqlGrJVjJyShVamky6bSZWgHt4yI\ngEtPDZwHCU/ZAQc2BwEyBgFg2UGk4lho1IB6Wjlh+NRlncPtH4nNb8wXIp3eXs7F\nlvWFEL1fns8tfTErDxkLu3JrYwKBgQD2hGWkpdxXHfjqVz1NJnliKF6JY6Hm519U\nYEtZaVWE7eYJ3kkOzhpC81Yq0ay0UgXtyObet7P3Kl5CsluDid7sme7Ndq6qHMwu\n/3bKY7b5xMQOcS28kMqI6CpCusi/Z4BW45OVsiBnbfG893yeAx/+qyhCfvQrBGem\nxU89zciH3wKBgFUJ4SLqSXueYLxMD/iyBy+tn2mVF7HiNqKVSEEL+k5UIxJYm1s5\nTXYgIYHPK0YZ0ylHVKWHTsaRDyt2ypjL8T4Y3m3gcYyk9Z4T2Arv0G3Yn5NcEyFR\n11Qm3sjjypu/Wd9DT8c0f6Dk42ay/iox3IdIuv//akEB8LeqghLheZcDAoGBAJjF\n7lP+cjIPIh7gl94DNQCO8h+E/mYiB6M71haAP/6UjJabCn3BXucU9NaugLBzkLcP\nZXyrLj3EJQyCilJXlC7fKu5sWcyU8jlCGrVM3K2nsrUckPKmbM4xy1b1eMmd9Bxl\nByajcI+IxGKOoc0vNJnYKqgjE2DBZxckenpb2KXTAoGBAJGE8OwSVDUlPlGj1pdZ\nhmwskbMJSi/IlZv+gZvP4GoZs0DqNwwoHCTIGIrlADQQF5edicJ28CVQBDyQPbB6\nmsGatE5ATJqN+9k5LuqPiGI1m/9p7+Ir44snupzoOM+FfqBszQxkp7Y36s4CYua4\n/rCFK650ocKYHcj3F1NZQ4bw\n-----END PRIVATE KEY-----\n",
    GOOGLE_CLIENT_EMAIL: "calender-key@avid-day-281003.iam.gserviceaccount.com",
    GOOGLE_PROJECT_NUMBER: "1014707876854",
    GOOGLE_CALENDAR_ID:
      "b03b9ae607f5002bf050f32f3d1d3dee0ef1dd7e7ef586c16b8000b64c207a6c@group.calendar.google.com",
    CLIENT_ID: "104191084579304173864",
    PRIVATE_KEY_ID: "fa0ab3903368eba4f6eefc47213d00e752ead182"
  
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
