import type { Metadata } from 'next'
import { DM_Mono, Instrument_Sans, Syne } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pluginbase.vercel.app'),
  title: {
    default: 'PluginBase — Assistant de lucidité pour ta collection de plugins',
    template: '%s · PluginBase',
  },
  description: 'Scanne ta collection de plugins audio, détecte les doublons, arrête d\'acheter ce que tu as déjà. En français, 100% dans ton navigateur.',
  keywords: ['plugins audio', 'VST', 'AU', 'inventaire plugins', 'producteur', 'home studio', 'DAW'],
  authors: [{ name: 'PluginBase' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'PluginBase — Assistant de lucidité pour ta collection de plugins',
    description: 'Tu as 247 plugins. Tu en utilises 12. Remets de l\'ordre dans ton studio.',
    siteName: 'PluginBase',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PluginBase',
    description: 'Tu as 247 plugins. Tu en utilises 12.',
    images: ['/og.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${syne.variable} ${instrumentSans.variable} ${dmMono.variable} h-full`}>
      <body className="h-full">
        <Providers>
          {children}
          <Toaster position="top-right" closeButton richColors />
        </Providers>
      </body>
    </html>
  )
}
