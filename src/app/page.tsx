import Formcomponent from '@/components/Formcomponent';
import Image from 'next/image'
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className='flex lg:justify-center bg-gradient-to-tr from-white via-slate-100 to-slate-200 w-screen h-screen bg-slate-800'>
      <div className='flex flex-col lg:flex-row md:justify-center md:items-center pt-24 px-6 md:p-0 w-full overflow-hidden'>
          <Formcomponent/>
          <Toaster />
      </div>
    </div>  
  )
}
