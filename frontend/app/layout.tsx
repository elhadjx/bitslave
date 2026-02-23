import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://bitslave.dev'),
  title: {
    default: 'Deploy Openclaw Agents Online | Bitslave',
    template: '%s | Bitslave - Openclaw Hosting'
  },
  description: 'Deploy and host your Openclaw autonomous AI agent in minutes. The easiest way to connect your Telegram bot with Openclaw and run it online 24/7.',
  keywords: [
    'Openclaw', 'Deploy Openclaw', 'Host Openclaw', 'Openclaw online', 'Openclaw agent', 
    'Telegram AI agent', 'Autonomous agent online', 'Openclaw hosting', 'LLM Telegram Bot', 'Bitslave'
  ],
  authors: [{ name: 'Bitslave' }],
  creator: 'Bitslave',
  publisher: 'Bitslave',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Deploy Openclaw Agents Online | Bitslave',
    description: 'Host your Openclaw autonomous AI agent in minutes. Connect your Telegram bot, provide API keys, and go live 24/7.',
    url: 'https://bitslave.dev', // Assuming bitslave.dev, change if otherwise
    siteName: 'Bitslave',
    images: [
      {
        url: '/logo.svg', // Ideally an OG image, but logo serves for now
        width: 800,
        height: 600,
        alt: 'Bitslave Openclaw Hosting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deploy Openclaw Agents Online | Bitslave',
    description: 'The easiest platform to host and run Openclaw Telegram agents 24/7.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
