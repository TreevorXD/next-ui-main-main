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
      <div className='w-full absolute flex justify-center'>
        <ul className='text-center'>
<li className='pt-7'>
</li>
<li>
<Image className='animate-custom-pulse rounded-lg mt-10'
        src="/../images/stilllogo.png"
        width={900}
        height={900}
        alt="antip2w"/>
</li>
<li className='pt-7'>
<Link className='text-4xl' href='/db'>Realm Database</Link>
</li>
<li className='pt-7'>
<Link className='text-4xl' href='/'>Discord</Link>
</li>
        </ul>
      </div>
    </main>
  );
}