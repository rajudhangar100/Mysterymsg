import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionWrapper from "../../comp/SessionWrapper";
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Platform where users can share their thoughts about their life journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
      <body className={inter.className}>
        <Navbar/>
        {children}
      <Toaster/>
      </body>
      </SessionWrapper>
    </html>
  );
}
