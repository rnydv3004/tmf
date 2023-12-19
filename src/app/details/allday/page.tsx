"use client";

import React, { useEffect, useState } from "react";
import AppointmentDetails from "@/components/AppointmentDetails";
import { DateTime } from "luxon";
import { UserData } from "@/types/details";
import Card from "@/components/Card";
import DetailComponent from "@/components/DetailComponent";

export default function Page() {
  

  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-4rem)] w-full bg-slate-200 shadow-md shadow-amber-500 p-2">
      <Card passedDate={""}/>
    </div>
  );
}
