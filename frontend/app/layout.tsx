import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://bitslave.cloud'),
  title: {
    default: 'Deploy & Host Openclaw Agents Online | Bitslave',
    template: '%s | Bitslave - Openclaw Hosting'
  },
  description: 'The easiest platform to host and deploy your Openclaw autonomous AI agent online 24/7. Connect your Telegram bot and go live in minutes.',
  keywords: [
    'Host Openclaw', 'Deploy Openclaw', 'Openclaw cloud hosting', 'Openclaw online', 'Openclaw agent', 
    'Telegram AI agent', 'Autonomous agent hosting', 'Openclaw easy setup', 'LLM Telegram Bot', 'Bitslave'
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
    url: 'https://bitslave.cloud', // Assuming bitslave.dev, change if otherwise
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bitslave",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "The easiest platform to host and deploy your Openclaw autonomous AI agent online 24/7.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
