import Formcomponent from "@/components/Formcomponent";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import bgImage from "../../public/5465845.jpg";


export default function Home() {
  return (
    <div className="flex lg:justify-center bg-transparent w-screen h-screen ">

      <div className="absolute top-0 left-0 h-screen w-screen overflow-hidden -z-10">
        <Image priority src={bgImage} alt={"backkground"} className="w-full h-screen" />
      </div>
      <div className="flex flex-col lg:flex-row md:justify-center md:items-center p-[70px] md:pt-0 px-0 md:p-0 w-full overflow-hidden">
        <Formcomponent />
        <Toaster />
      </div>
    </div>
  );
}
