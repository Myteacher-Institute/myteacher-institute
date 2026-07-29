import type { Metadata } from "next";
import { Geist, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "./components/SocketProvider";
import { NetworkStatus } from "./components/NetworkStatus";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Myteacher Institute",
  description: "Center of IT solutions and digital courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>
          {children}
        </SocketProvider>
        <NetworkStatus />
      </body>
    </html>
  );
}
