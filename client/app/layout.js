import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Weather Application",
  description: "A simple weather application built with Next.js,Nest.js and Tailwind CSS.",
  icons:{
  icon: '/Logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-body bg-[#eef1f6] dark:bg-[#0f1620] text-ink dark:text-[#edf1f6] transition-colors">{children}</body>
    </html>
  );
}

