'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { Button } from '@nextui-org/button' 
import { useRouter } from 'next/navigation'

const montserrat = Montserrat({ 
  weight: '600',
  subsets: ['latin'] })
 
export default function App() {
  const router = useRouter()

  return (
    
    <main className={montserrat.className}>
      <div className='w-full absolute flex justify-center'>
        <ul className='text-center'>
<li className='pt-7'>
</li>
<li>
<Image className='animate-custom-pulse rounded-lg mt-10'
        src="/../images/logo3.png"
        width={900}
        height={900}
        alt="antip2w"/>
</li>
<li className='pt-10'>
<Button size='lg' variant='ghost' onClick={() => router.push('/db')}>
        Database
      </Button>
</li>
<li className='pt-10'>
<Button size='lg' variant='ghost' onClick={() => router.push('/socials')}>
        Socials
      </Button>
</li>
<li className='pt-10'>
<Button size='lg' variant='ghost' onClick={() => router.push('https://discord.gg/antip2w')}>
        Discord
      </Button>
</li>

        </ul>
      </div>
    </main>
  );
}