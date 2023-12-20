import Link from "next/link";
// import '../globals.css'
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Userauth from "@/components/Userauth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let loggedIn = false;
  const cookieStore = cookies();
  const user = cookieStore.get("user");

  // console.log(user)
  if (user) {
    loggedIn = true;
  }

  // console.log(loggedIn)

  return (
    <section className="h-full w-full overflow-hidden">
      <div className="fixed top-0 left-0 w-screen h-screen bg-white z-[999] flex justify-center items-center md:hidden">
        <p className="text-slate-700 text-center flex justify-center items-center flex-col gap-8 font-bold uppercase ">
          <svg
            className=" text-gray-800 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
            height="55"
            width={"55"}
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"
            />
          </svg>
          Switch to laptop/desktop
        </p>
      </div>
      {loggedIn ? (
        <div className="h-full w-full  overflow-hidden">
          <Header />
          {children}
        </div>
      ) : (
        <Userauth />
      )}
      <Toaster />
    </section>
  );
}
