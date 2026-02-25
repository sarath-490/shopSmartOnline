import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Shop Smart Online — Expert Reviews & Buying Guides',
    template: '%s | Shop Smart Online',
  },
  description:
    'Expert reviews, data-driven comparisons, and honest buying advice. Shop smarter and spend better with our in-depth product guides.',
  metadataBase: new URL(process.env.APP_URL || 'https://shopsmartonline.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Shop Smart Online',
    title: 'Shop Smart Online — Expert Reviews & Buying Guides',
    description:
      'Expert reviews, data-driven comparisons, and honest buying advice.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Smart Online',
    description:
      'Expert reviews, data-driven comparisons, and honest buying advice.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Shop Smart Online',
              url: process.env.APP_URL || 'https://shopsmartonline.com',
              logo: `${process.env.APP_URL || 'https://shopsmartonline.com'}/logo.png`,
              description:
                'Expert reviews, data-driven comparisons, and honest buying advice.',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
