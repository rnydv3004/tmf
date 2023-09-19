import Formcomponent from '@/components/Formcomponent'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className='flex justify-center items-center bg-white'>
      <div className='flex flex-col lg:flex-row justify-center items-center gap-3 p-2 md:p-10 mt-10'>
          <Formcomponent/>
          <Toaster />
      </div>
    </div>  
  )
}
