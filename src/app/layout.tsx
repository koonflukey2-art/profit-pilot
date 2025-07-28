import type {Metadata} from 'next';
import { Space_Grotesk } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Profit Pilot',
  description: 'Profit & Metrics Planner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-headline antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
