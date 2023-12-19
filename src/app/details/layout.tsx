import Link from 'next/link'
// import '../globals.css'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import Header from '@/components/Header'
import Userauth from '@/components/Userauth'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    let loggedIn = false
    const cookieStore = cookies()
    const user = cookieStore.get('user')

    // console.log(user)
    if (user){
        loggedIn = true
    }
    
    // console.log(loggedIn)

    return (
        <section className='h-full w-full overflow-hidden'>
            {loggedIn ? (
                <div className='h-full w-full  overflow-hidden'>
                    <Header />
                    {children}
                </div>)
                :
                (<Userauth/>)}
        <Toaster/>
        </section>

    )
}