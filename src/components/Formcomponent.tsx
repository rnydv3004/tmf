"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Logo from "./../../public/png.png";
import Image from "next/image";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { DateTime } from "luxon";
import { addSubscription } from "@/helper/subscribe";
import AppointmentDetails from "./AppointmentDetails";

const timeZones = [
  "Asia/Kolkata",
  "America/Toronto",
  "America/New_York",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/St_Johns",
  "America/Halifax",
];

export default function Formcomponent() {
  const [dateValue, setDateValue] = useState('yyyy-MM-dd');
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState(true);
  const [dateSlots, setDateSlots]: any = useState();
  const [allSlots, setAllSlots] = useState([]);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [calenderLoader, setCalenderLoader] = useState(true);
  const [timeLoader, setTimeLoader] = useState(false);
  const [slotIdentifier, setSlotIdentifier] = useState(false);
  const [noSlotIdentifier, setNoSlotIdentifier] = useState(false);

  const [appointmentDetails, setAppointmentDetails] = useState({
    firstName: "",
    lastName: "",
    type: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
    clienttime: "",
    timezone: "America/Toronto",
    eventId: "",
  });

  const handleTimeZoneChange = (event: { target: { value: any } }) => {
    setAppointmentDetails({
      ...appointmentDetails,
      timezone: event.target.value,
    });
  };

  function checkFields() {
    // console.log(appointmentDetails)
    if (
      appointmentDetails.firstName === "" ||
      appointmentDetails.lastName === "" ||
      appointmentDetails.phone === "" ||
      appointmentDetails.email === "" ||
      appointmentDetails.date === "" ||
      appointmentDetails.time === ""
    ) {
      toast.error("Please fill required details");
      console.log(appointmentDetails);
      return false;
    }
    return true;
  }

  async function bookAppointment() {
    try {
      // ADD GOOGLE EVENT

      const response = await fetch("/api/addevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
        }),
      });

      if (response.ok) {
        // Parse the response JSON data
        const responseData = await response.json();

        // Update the eventId in the appointmentDetails state
        setAppointmentDetails((prevDetails) => ({
          ...prevDetails,
          eventId: responseData.details,
        }));
      } else {
        // If the request was not successful, handle the error
        console.error("Error:", response.statusText);
      }

      // ADD DATA TO GOOGLESHEET
      const response2 = await fetch("/api/addgsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          phone: appointmentDetails.phone,
          email: appointmentDetails.email,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
        }),
      });

      // You can handle the response here if needed
      if (!response.ok) {
        // Handle non-successful response (e.g., error handling)
        console.error("Failed to add event:", response.statusText);
      } else if (!response2.ok) {
        // Handle non-successful response (e.g., error handling)
        console.error("Failed to add details in sheet:", response2.statusText);
      }
      {
        // Event added successfully
        toast.success("Confirmation email sent");
        console.log("Event added successfully");
      }

      // MAILER
      const mailResponse = await fetch("/api/mailer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentDetails),
      });
      if (!mailResponse.ok) {
        // Handle error if the response status is not OK (e.g., 404, 500).
        toast.error(
          "Error in sending mail. Our team will connect you by phone"
        );
        throw new Error(`Error fetching data. Status: ${mailResponse.status}`);
      }

      // REMINDER MAIL SCHEDULER
      const reminderScheduler = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentDetails),
      });

      // BEEHIVE SUBSCRIPTION
      const subscription = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentDetails),
      });

      if (!subscription.ok) {
        // Handle error if the response status is not OK (e.g., 404, 500).
        toast.error(
          "Error in sending mail. Our team will connect you by phone"
        );
        throw new Error(`Error fetching data. Status: ${subscription.status}`);
      }

      return response;
    } catch (error) {
      // console.error("Error fetching data:", error);
      throw error;
    }
  }

  function chips(text: string, state: boolean, index: number) {
    const serverTimeZone = "America/Toronto";
    const ESTTimeZone = appointmentDetails.timezone;

    const inputTime = text;

    const fromTime = DateTime.fromFormat(inputTime, "HH:mm", {
      zone: serverTimeZone,
    });

    const toTime = fromTime.setZone(ESTTimeZone);

    const resultantTime = toTime.toFormat("HH:mm");

    return (
      <button
        key={index}
        type="button"
        disabled={state}
        className={`disabled:bg-slate-500 disabled:hover:scale-100
             ${
               selectedSlot === text ? "bg-green-600" : "bg-blue-500"
             } h-fit w-fit py-1 px-5 rounded-full text-sm transition-transform transform ease-in-out duration-300 hover:scale-105 active:scale-100 select-none cursor-pointer text-white`}
        onClick={(e) => {
          e.preventDefault();
          setSelectedSlot(text);
          setAppointmentDetails({
            ...appointmentDetails,
            time: text,
            clienttime: resultantTime,
          });
          // console.log("Seleted slot:", selectedSlot)
        }}
      >
        {resultantTime}
      </button>
    );
  }

  useEffect(() => {
    const firebaseBook = async () => {
      try {
        const response = await fetch("/api/bookappointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentDetails),
        });

        if (!response.ok) {
          throw new Error(`Error fetching data. Status: ${response.status}`);
        }

        const data = await response.json();
        // Do something with the data if needed
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    if (!(appointmentDetails.phone === "")) {
      firebaseBook();
    }
  }, [appointmentDetails.eventId]);

  async function fetchDates() {
    try {
      const myZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const today = DateTime.now().setZone(myZone).toFormat("yyyy-MM-dd");

      setAppointmentDetails({ ...appointmentDetails, timezone: myZone });

      const response = await fetch("/api/getdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({
          checkdate: today,
        }),
      });

      if (!response.ok) {
        // Handle error if the response status is not OK (e.g., 404, 500).
        throw new Error(`Error fetching data. Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the response JSON data

      return data; // Return the data if needed
    } catch (error) {
      // console.error("Error fetching data:", error);
      throw error; // Rethrow the error for higher-level error handling if needed
    }
  }

  useEffect(() => {
    const dates = fetchDates();

    dates.then((data) => {
      setDateSlots(data);
      setCalenderLoader(false);
    });
  }, []);

  async function fetchSlots(checkDate: any) {
    try {
      const response = await fetch("/api/gettime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({
          checkdate: checkDate,
        }),
      });

      if (!response.ok) {
        // Handle error if the response status is not OK (e.g., 404, 500).
        throw new Error(`Error fetching data. Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the response JSON data

      // console.log("Time: ", data)
      return data; // Return the data if needed
    } catch (error) {
      // console.error("Error fetching data:", error);
      throw error; // Rethrow the error for higher-level error handling if needed
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (checkFields()) {
      // console.log('Booking Appointment')
      setDialog(true);
      try {
        // Call your bookAppointment function here
        const response = await bookAppointment();
        // console.log(response)
        if (response.status === 200) {
          setLoading(false);
          setBookingStatus(true);
        } else {
          setLoading(false);
          setBookingStatus(false);
        }
      } catch (error) {
        // console.error("Error in booing details form: Please try again later", error);
        // Handle the error here if needed
      }
    }
  };

  return (
    <div className=" md:h-[105%] shadow-sm bg-opacity-20 rounded-lg w-full md:w-[60%]">
      <Link
        href={"/details"}
        className="absolute top-5 right-5 block w-fit rounded-md text-[#FFEBCD] bg-[#e1ac27] z-40 px-5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-[#bb8f22] active:bg-[#bb8f22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 "
      >
        Admin
      </Link>
      {/* <div className="mx-auto max-w-2xl text-center flex justify-center items-center flex-col gap-2">
        <p className="mt-2 text-sm md:text-base leading-5 text-gray-600">
          Book a free Appointment with our one of best tax consultants
        </p>
      </div> */}
      {dialog ? (
        <div className="flex justify-center items-center w-screen h-screen absolute top-0 bottom-0 left-0 right-0 z-50">
          <div className="flex flex-col bg-white rounded-lg p-5 md:p-10 justify-center items-center gap-6 m-10">
            {!loading ? (
              <div className="flex flex-col justify-center items-center gap-5 ">
                <div className="h-16 w-fit flex">
                  <Image
                    src={Logo}
                    alt={"Taxmechnaic Logo"}
                    className="h-16 w-auto"
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px"
                  />
                </div>
                {bookingStatus ? (
                  <h1 className="text-slate-900 text-sm lg:w-[400px] text-center font-medium flex-wrap">
                    Thanks for booking appointment with Taxmechanic. The meeting
                    link will be shared on mail.
                  </h1>
                ) : (
                  <h1 className="text-red-700 text-xs text-center font-bold flex-wrap">
                    Booking Falied due to some technical error! Please try again
                    later.
                  </h1>
                )}
                <Link href={"https://www.taxmechanic.ca/"}>
                  <p className="w-fit rounded-md text-[#FFEBCD] bg-[#e1ac27] z-40 px-5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-[#bb8f22] active:bg-[#bb8f22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Visit us
                  </p>
                </Link>
              </div>
            ) : (
              <span className="loader"></span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          {/* LOGO IN ABSOLUTE */}
          <div className="h-12 w-fit flex absolute top-5 left-5">
            <Image
              src={Logo}
              alt={"Taxmechnaic Logo"}
              className=" w-auto"
              sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className=" grid grid-cols-2 md:gap-5 w-full h-[calc(100vh-96px)] md:h-fit pb-10  overflow-y-auto px-6 lg:px-0 "
          >
            {/* User Details */}
            <div className="flex flex-col w-full md:max-w-[300px] col-span-2  md:col-span-1 gap-4 gap-x-8 gap-y-6 sm:grid-cols-2 mx-auto">
              <div className="flex flex-col">
                <label
                  htmlFor="first-name"
                  className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs"
                >
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={appointmentDetails.firstName}
                  autoComplete="given-name"
                  onChange={(e) => {
                    e.preventDefault();
                    setAppointmentDetails({
                      ...appointmentDetails,
                      firstName: e.target.value,
                    });
                  }}
                  className="bg-[#FFEBCD] text-[#8B4513] md:min-w-[280px] rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="last-name"
                  className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs"
                >
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={appointmentDetails.lastName}
                  onChange={(e) => {
                    e.preventDefault();
                    setAppointmentDetails({
                      ...appointmentDetails,
                      lastName: e.target.value,
                    });
                  }}
                  autoComplete="family-name"
                  className="bg-[#FFEBCD] text-[#8B4513]  rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={appointmentDetails.email}
                  id="email"
                  onChange={(e) => {
                    e.preventDefault();
                    setAppointmentDetails({
                      ...appointmentDetails,
                      email: e.target.value,
                    });
                  }}
                  autoComplete="email"
                  className="bg-[#FFEBCD] text-[#8B4513]  rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone-number"
                  className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs"
                >
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone-number"
                  id="phone-number"
                  value={appointmentDetails.phone}
                  onChange={(e) => {
                    e.preventDefault();
                    setAppointmentDetails({
                      ...appointmentDetails,
                      phone: e.target.value,
                    });
                  }}
                  autoComplete="tel"
                  className="bg-[#FFEBCD] text-[#8B4513] rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-semibold text-sm"
                />
              </div>

              {/* Time Zone */}

              <div className="col-span-1">
                <div className="flex flex-col w-full">
                  <p className="bg-transparent text-slate-500 rounded-lg py-3 md:py-2 font-medium text-xs">
                    Your Time Zone:
                  </p>
                  <select
                  id="timezoneDd"
                    value={appointmentDetails.timezone}
                    onChange={handleTimeZoneChange}
                    className="bg-[#FFEBCD] text-[#8B4513] w-full  rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-medium text-sm"
                  >
                    {timeZones.map((zone, index) => (
                      <option key={index} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Date */}

              <div className="rounded-lg p-0 text-black">
                <div className="flex flex-col relative">
                  {dateSlots && dateSlots.first && (
                    <>
                      <label
                        htmlFor="appointmentDate"
                        className="bg-transparent text-slate-500 rounded-lg py-0 font-medium text-xs"
                      >
                        Appointment Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mb-10">
                        <input
                          type="date"
                          value={dateValue}
                          disabled={false}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setNoSlotIdentifier(true);
                            setTimeLoader(true);
                            setSlotIdentifier(true);
                            setAppointmentDetails({
                              ...appointmentDetails,
                              date: newValue,
                            });

                            setDateValue(e.target.value)

                            const timeInfo = fetchSlots(newValue);
                            timeInfo.then((data) => {
                              setAllSlots(data.value);
                              setAvailableSlot(data.bookedslots);
                              setTimeLoader(false);
                            });
                          }}
                          min={dateSlots.first}
                          max={dateSlots.second}
                          //   style={{ pointerEvents: "none" }}
                          className="bg-[#FFEBCD] text-[#8B4513] w-full  rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-medium text-sm z-40 opacity-0 absolute
                          top-0"
                        />
                        <div className="w-full bg-[#FFEBCD] text-[#8B4513] rounded-lg px-4 py-3 md:py-2 outline-[#FFDEAD] font-medium text-sm flex justify-between absolute
                         top-0 -z-0">
                          {" "}
                          <span className="h-full w-fit ">{dateValue}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            width={"16"}
                            height={"16"}
                            
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="w-[80%] h-full absolute top-0 z-10 bg-opacity-0"></div>
                </div>
              </div>

              {calenderLoader ? (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <span className="loader absolute w-full h-full top-0 bottom-0 left-0 right-0 z-50"></span>
                  <span className="text-xs font-semibold text-amber-600">
                    Loading Available Slots...
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Slots */}
            <div className="col-span-2 md:col-span-1 flex justify-center w-full items-center flex-col">
              {/* Calender */}

              {/* Slots */}
              <div className="flex flex-wrap gap-2 w-full h-full justify-start items-start max-w-sm mx-auto">
                <div className="flex flex-col md:flex-col-reverse gap-4 pt-10 md:p-0 w-full justify-start items-center ">
                  {timeLoader ? (
                    <span className="loader"></span>
                  ) : (
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      {allSlots.map((time, index) => {
                        const isAvailable = availableSlot.includes(time);

                        return (
                          <div
                            key={index}
                            className="flex justify-center items-center gap-2"
                          >
                            {chips(time, isAvailable, index)}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!calenderLoader ? (
                    !timeLoader ? (
                      <div
                        className={`${
                          noSlotIdentifier ? "" : "hidden"
                        } flex justify-center items-center flex-wrap gap-2`}
                      >
                        {allSlots.length === 0 ? (
                          <p className="text-slate-700 font-semibold text-xs bg-slate-100 p-2 rounded-md flex-wrap">
                            {" "}
                            No available slot today due to holiday/weekend
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}

                  {!slotIdentifier ? (
                    ""
                  ) : (
                    <div className="text-black flex flex-wrap justify-center items-center bg-slate-200 rounded-lg w-fit p-4 gap-2">
                      <div className="flex gap-2  justify-center items-center font-semibold text-xs">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>{" "}
                        Booked
                      </div>
                      <div className="flex gap-2 justify-center items-center font-semibold text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>{" "}
                        Available
                      </div>
                      <div className="flex gap-2 justify-center items-center font-semibold text-xs">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>{" "}
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 my-10 md:my-0 md:fixed md:bottom-5 md:right-5 w-full md:w-fit">
              <button
                type="submit"
                className="block w-full md:w-fit rounded-md text-[#FFEBCD] bg-[#e1ac27] z-40 px-5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-[#bb8f22] active:bg-[#bb8f22] focus-visible:outline  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 "
              >
                Book Appointment
              </button>
            </div>
            </div>
            {/* BOOKK APPOINTMENT BUTTON IN ABSOLUTE */}
            
          </form>
        </div>
      )}
    </div>
  );
}
