'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'
 
const montserrat = Montserrat({ 
  weight: '600',
  subsets: ['latin'] })
 
export default function App() {
  return (
    <main className={montserrat.className}>
      <div className='w-full absolute flex justify-center mt-20'>
        <ul className='text-center'>
            <li>
            <Link className='text-7xl' href='/socials'>Socials</Link>
            </li>
        </ul>
      </div>
    </main>
  );
}