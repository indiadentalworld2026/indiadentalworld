import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IndiaDentalWorld | Find a dentist in your words',
  description:
    'Search for dental clinics by treatment, location, and what you need. Compare clinic information before you decide.',
  openGraph: {
    title: 'IndiaDentalWorld | Find a dentist in your words',
    description: 'Find dental clinics and compare the information that matters to you.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
