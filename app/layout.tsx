import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Link from 'next/link'
import ThemeSwitcher from './components/ThemeSwitcher'
import Image from 'next/image'
import Script from 'next/script'
const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Anti P2W',
  description: 'Anti P2W Movement: Bedrock Edition'
}


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
      <html lang='en'>
        <body className={inter.className}>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5323398300828688"></script>
          <Providers>
      
            <header className='py-6'>

              <nav className='container flex items-center'>
    
                <ul>
                  <li className='inline pl-10 pr-10'>
                  <Link className='z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium bg-transparent px-unit-6 min-w-unit-24 h-unit-12 text-medium gap-unit-3 rounded-large [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none border-default text-default-foreground hover:!bg-default' href="/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
      </svg></Link>
                  </li>

                </ul>
                <ThemeSwitcher />
              </nav>
            </header>
            <main>{children}</main>
            <footer></footer>
          </Providers>
        </body>
      </html>
  )
}
