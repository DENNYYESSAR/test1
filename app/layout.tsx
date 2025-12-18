import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfyaLynx - Your Health, Intelligently Managed",
  description: "AI-powered healthcare assistant for diagnosis, clinic finding, and health tracking.",
  icons: {
    icon: '/icon.svg',
  },
};

import { AuthProvider } from '@/context/AuthContext';
import SOSButton from '@/components/SOSButton';
import ChatBot from '@/components/ChatBot';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <div className="page-transition">
            {children}
          </div>
          <SOSButton />
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
