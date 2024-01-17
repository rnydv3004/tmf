"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "@/types/details";
import { DateTime } from "luxon";

export default function Card() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [transformedData, setTransformmedData] = useState<UserData[]>([]);
  const [unFilterData, setUnFilterData] = useState<UserData[]>([]);
  const [loader, setLoader] = useState(true);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    if (unFilterData.length > 0) {
      let filteredData: UserData[] = [];

      if (filter === "All") {
        // If the filter is 'All', copy all data from unfilteredData
        setTransformmedData(unFilterData);
      } else if (filter === "today") {
        const now = DateTime.now().setZone("America/Toronto");
        const today = now.toFormat("yyyy-MM-dd");
        setTransformmedData(unFilterData.filter((item) => item.date === today));
      } else if (filter === "tomorrow") {
        const now = DateTime.now().setZone("America/Toronto");
        const tomorrow = now.plus({ days: 1 }).toFormat("yyyy-MM-dd");
        setTransformmedData(
          unFilterData.filter((item) => item.date === tomorrow)
        );
      } else if (filter === "yesterday") {
        const now = DateTime.now().setZone("America/Toronto");
        const yesterday = now.minus({ days: 1 }).toFormat("yyyy-MM-dd");
        setTransformmedData(
          unFilterData.filter((item) => item.date === yesterday)
        );
      }
    }
  }, [filter, unFilterData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: "",
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching data. Status: ${response.status}`);
        }

        const resdata = await response.json();

        const transformedDataTemp: UserData[] = [];

        Object.entries(resdata.data).forEach(
          ([date, dateData]: [string, any]) => {
            Object.entries(dateData).forEach(
              ([phone, transformedData]: [string, any]) => {
                const userData: UserData = {
                  id: transformedDataTemp.length + 1,
                  lastName: transformedData.lastName || "",
                  firstName: transformedData.fullName || "",
                  phone: phone,
                  email: transformedData.email || "",
                  date: date || "",
                  time: transformedData.time || "",
                  status: transformedData.type || "Upcoming",
                  message: transformedData.message || "",
                  eventId: transformedData.eventId || "",
                  content: "",
                };

                transformedDataTemp.push(userData);
              }
            );
          }
        );

        console.log("Final Data", transformedDataTemp);
        setLoader(false);
        setUnFilterData(transformedDataTemp);
      } catch (error) {
        setLoader(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  function markAsDone() {
    const refer =
      transformedData[selectedItemIndex].date +
      "/" +
      transformedData[selectedItemIndex].phone;

    axios
      .post(`/api/updateData`, {
        reference: refer,
        field: "type",
        value: "Done",
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Marked as Done!");
          setLoader(false);

          setTransformmedData((prevTransformedData) =>
            prevTransformedData.map((item: UserData, index: number) =>
              index === selectedItemIndex ? { ...item, status: "Done" } : item
            )
          );
        } else {
          setLoader(false);
          toast.error("Some issue occurred!");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error:", error.message);
        throw new Error("Some issue occurred");
      });
  }

  async function updateValues(changeField: string, newValue: string) {
    if (!(changeField === "message")) {
      const response = await axios.delete(`/api/cancelevent`, {
        data: { eventId: transformedData[selectedItemIndex].eventId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Event canceled successfully:", response.data);
      // Access response data here, if needed
      const eventData = response.data;
      console.log("Event data:", eventData);
    }

    const refer =
      transformedData[selectedItemIndex].date +
      "/" +
      transformedData[selectedItemIndex].phone;
    try {
      const response = await axios.post(`/api/updateData`, {
        reference: refer,
        field: changeField,
        value: newValue,
      });

      if (!(changeField === "message")) {
        if (response.status === 200) {
          const mailResponse = await fetch("/api/cancelmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: transformedData[selectedItemIndex].firstName,
              email: transformedData[selectedItemIndex].email,
              date: transformedData[selectedItemIndex].date,
            }),
          });
          if (!mailResponse.ok) {
            // Handle error if the response status is not OK (e.g., 404, 500).
            toast.error(
              "Error in sending mail. Our team will connect you by phone"
            );
            throw new Error(
              `Error fetching data. Status: ${mailResponse.status}`
            );
          } else {
            toast.success("Cancellation Mail sent!");
            setLoader(false);
            setTransformmedData((prevTransformedData) =>
              prevTransformedData.map((item: UserData, index: number) =>
                index === selectedItemIndex ? { ...item, content: "" } : item
              )
            );
            setLoader(false);
          }
          setLoader(false);
          toast.success("Appointment Canceled!");
          setTransformmedData((prevTransformedData) =>
            prevTransformedData.map((item: UserData, index: number) =>
              index === selectedItemIndex
                ? { ...item, status: "Canceled" }
                : item
            )
          );
        } else {
          toast.error("Some issue occured!");
        }
      } else {
        if (response.status === 200) {
          setLoader(false);
          toast.success("Notes Updated");
        } else {
          setLoader(false);
          toast.error("Some issue occured!");
        }
      }
    } catch (error: any) {
      setLoader(false);
      console.error("Error:", error.message);
      throw new Error("Some issue occurred");
    }
  }

  async function updateNotes() {
    const refer = `${transformedData[selectedItemIndex].date}/${transformedData[selectedItemIndex].phone}`;

    try {
      const response = await axios.post(`/api/updateData`, {
        reference: refer,
        field: "message",
        value: transformedData[selectedItemIndex].message,
      });

      if (response.status === 200) {
        toast.success("Notes Updated!!");
      } else {
        toast.error("Some issue occured!");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error("Some issue occurred");
    }
  }

  async function sendMail() {
    const mailResponse = await fetch("/api/custommailer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: transformedData[selectedItemIndex].firstName,
        email: transformedData[selectedItemIndex].email,
        message: transformedData[selectedItemIndex].content,
      }),
    });
    if (!mailResponse.ok) {
      // Handle error if the response status is not OK (e.g., 404, 500).
      toast.error("Error in sending mail. Our team will connect you by phone");
      throw new Error(`Error fetching data. Status: ${mailResponse.status}`);
    } else {
      toast.success("Mail sent!");
      setLoader(false);
      setTransformmedData((prevTransformedData) =>
        prevTransformedData.map((item: UserData, index: number) =>
          index === selectedItemIndex ? { ...item, content: "" } : item
        )
      );
      setLoader(false);
    }
  }

  return (
    <div className="grid grid-cols-3 h-full w-full bg-slate-300 overflow-hidden">
      {loader ? <Loader /> : ""}

      {!unFilterData || unFilterData.length < 1 ? (
        !loader ? (
          <NoAppointment />
        ) : (
          ""
        )
      ) : (
        <div>
          <div className="w-full m-2 flex gap-2 justify-start h-8">
            <button
              onClick={() => {
                setSelectedItemIndex(-1)
                setFilter("today");
              }}
              className={`${
                filter === 'today' ? "bg-blue-700 hover:bg-blue-600" : "bg-slate-500"
              } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setSelectedItemIndex(-1)
                setFilter("yesterday");
              }}
              className={`${
                filter === 'yesterday' ? "bg-blue-700 hover:bg-blue-600" : "bg-slate-500"
              } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
            >
              Yesterday
            </button>
            <button
              onClick={() => {
                setSelectedItemIndex(-1)
                setFilter("tomorrow");
              }}
              className={`${
                filter === 'tomorrow' ? "bg-blue-700 hover:bg-blue-600" : "bg-slate-500"
              } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => {
                setSelectedItemIndex(-1)
                setFilter("All");
              }}
              className={`${
                filter === 'All' ? "bg-blue-700 hover:bg-blue-600" : "bg-slate-500"
              } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
            >
              All
            </button>
          </div>

          {!loader && unFilterData.length > 1 && transformedData.length < 1 ? (
            <NoAppointment />
          ) : (
            <ul
              style={{ height: "calc(100vh - 120px)" }}
              className="col-span-1 p-2.5 flex flex-col gap-3 overflow-y-auto"
            >
              {transformedData.map((item: UserData, index: number) => (
                <li key={index}>
                  <div
                    onClick={() => {
                      setSelectedItemIndex(index);
                    }}
                    className={` p-5 bg-[#ffffff] shadow-md text-gray-600 rounded-lg`}
                  >
                    <div className="flex justify-between">
                      <p className="w-full text-xs font-bold">
                        <span className="flex gap-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            height="14"
                            width="14"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {item.time}
                        </span>{" "}
                        <span className="flex gap-1 pt-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            height="14"
                            width="14"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                          </svg>
                          {item.date}
                        </span>
                      </p>
                      <button
                        className={`text-white rounded-md font-medium py-2 px-3 min-w-[100px] text-xs ${
                          item.status === "Canceled"
                            ? "bg-red-500"
                            : item.status === "Done"
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.status}
                      </button>
                    </div>
                    <div className="pt-3 w-full justify-center flex flex-col">
                      <div className=" bg-gradient-to-t p-2 rounded-lg shadow-md">
                        <p className="text-sm w-full text-left font-semibold text-slate-800 flex gap-2 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            height="18"
                            width="18"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Appointment with{" "}
                          <span className="font-semibold text-base text-neutral-900">
                            {item.firstName} {item.lastName}
                          </span>
                        </p>
                        <p className="text-sm font-semibold flex gap-3 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="nonmaile"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            height="14"
                            width="14"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                          </svg>
                          {item.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* List View ends here */}
      <div className="col-span-2 flex flex-col p-2 w-full h-full overflow-y-auto">
        {/* transformedData Tab Starts from here */}
        {selectedItemIndex > -1 ? (
          <div className=" bg-white gap-x-10 ga p-10 w-full h-fit rounded-md">
            <div className="flex gap-5 pb-5">
              <button
                disabled={
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? true
                    : false
                }
                onClick={() => {
                  setLoader(true);
                  updateValues("type", "Canceled");
                }}
                className={`${
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? "bg-slate-500"
                    : "bg-blue-700 hover:bg-blue-600"
                } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
              >
                Cancel
              </button>
              <button
                disabled={
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? true
                    : false
                }
                onClick={() => {
                  updateValues("type", "Rescheduled");
                  window.open(
                    "https://taxmechanic-appointment.vercel.app/",
                    "_blank"
                  );
                }}
                className={`${
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? "bg-slate-500"
                    : "bg-blue-700 hover:bg-blue-600"
                } text-white rounded-md py-2 px-3 min-w-[100px] text-xs`}
              >
                Reshedule
              </button>

              <button
                disabled={
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? true
                    : false
                }
                onClick={() => {
                  setLoader(true);
                  markAsDone();
                }}
                className={`${
                  transformedData[selectedItemIndex].status === "Canceled" ||
                  transformedData[selectedItemIndex].status === "Done"
                    ? "bg-slate-500"
                    : "bg-blue-700 hover:bg-blue-600"
                } text-white rounded-md py-2 px-3 min-w-[100px] text-xs  `}
              >
                Mark as Done
              </button>
            </div>
            <div className=" flex flex-wrap gap-10 rounded-md ">
              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  First Name
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].firstName}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Last Name
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].lastName}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Email
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].email}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Phone
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].phone}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Date
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].date}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Time
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].time}
                />
              </div>

              <div className="flex flex-col gap-1 h-fit">
                <label
                  htmlFor="businessName"
                  className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
                >
                  Status
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="bg-bodydark1 rounded-md px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                  value={transformedData[selectedItemIndex].status}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 h-fit relative mt-10">
              <label
                htmlFor="businessName"
                className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
              >
                Notes
              </label>
              <textarea
                className=" rounded-md w-full min-w-[500px] min-h-[100px] px-4 py-2 outline-primary font-semibold text-sm bg-slate-300 outline-none text-slate-600"
                onChange={(e) => {
                  setTransformmedData((prevTransformedData) =>
                    prevTransformedData.map((item: UserData, index: number) =>
                      index === selectedItemIndex
                        ? { ...item, message: e.target.value }
                        : item
                    )
                  );
                }}
                value={transformedData[selectedItemIndex].message}
              />
              <button
                onClick={() => {
                  if (!(transformedData[selectedItemIndex].message === "")) {
                    setLoader(true);
                    updateValues(
                      "message",
                      transformedData[selectedItemIndex].message
                    );
                  }
                }}
                className="text-white rounded-md py-2 px-3 min-w-[100px] text-xs bg-blue-700 absolute bottom-2 right-2 hover:bg-blue-600"
              >
                Update
              </button>
            </div>

            <div className="flex flex-col gap-1 h-fit relative mt-10">
              <label
                htmlFor="businessName"
                className="bg-transparent rounded-md text-gray-500 py-0 font-semibold text-[10px]"
              >
                Write mail to {transformedData[selectedItemIndex].firstName}{" "}
                {transformedData[selectedItemIndex].lastName}
              </label>
              <textarea
                className="bg-slate-300 rounded-md w-full min-w-[500px] min-h-[100px] px-4 py-2 outline-primary font-semibold text-sm text-slate-600 outline-none"
                onChange={(e) => {
                  setTransformmedData((prevTransformedData) =>
                    prevTransformedData.map((item: UserData, index: number) =>
                      index === selectedItemIndex
                        ? { ...item, content: e.target.value }
                        : item
                    )
                  );
                }}
                value={transformedData[selectedItemIndex].content}
              />
              <button
                onClick={() => {
                  if (!(transformedData[selectedItemIndex].content === "")) {
                    setLoader(true);
                    sendMail();
                  }
                }}
                className="text-white rounded-md py-2 px-3 min-w-[100px] text-xs bg-blue-700 absolute bottom-2 right-2 hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export function Loader() {
  return (
    <div className="fixed bg-white bg-opacity-25 h-screen w-screen top-0 left-0 flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
}

export function NoAppointment() {
  return (
    <div className="bg-white bg-opacity-25 h-full w-full bottom-0 flex justify-center items-center">
      <p className="text-lg text-center font-semibold text-slate-800">
        No Appointments!
      </p>
    </div>
  );
}
