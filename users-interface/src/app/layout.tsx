import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";
import "@ant-design/v5-patch-for-react-19";
import TopNavbar from "@/components/nav-bar/nav-bar";
import ClientComponent from "@/providers/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getActualYear = () => {
    return new Date().getFullYear();
  };

  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-gradient-to-r bg-gray-100">
        <Providers>
          <header className="sticky top-0 z-10 bg-white w-full shadow-md">
            <TopNavbar />
          </header>
          <main className="flex-grow overflow-y-auto flex flex-col items-center text-black">
            <ClientComponent />
            <div className="flex items-center justify-center w-full inset-0 z-0">{children}</div>
          </main>
          <footer className="border-t border-gray-400 text-gray-400 py-4 text-center w-full">
            <p className="text-sm sm:text-base">© {getActualYear()} User App</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
