"use client";
import React, { useEffect, useState } from "react";
import AppointmentDetails from "@/components/AppointmentDetails";
import Card from "@/components/Card";

interface UserData {
  id: number;
  lastName: string;
  firstName: string;
  phone: number;
  email: string;
  date: string;
  time: string;
}

export default function Page() {
  const [transformedData, setTransformedData]: any = useState("");


  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-4rem)] w-full bg-slate-200 shadow-md shadow-amber-500 p-2">
      <Card/>
    </div>
  );
}

