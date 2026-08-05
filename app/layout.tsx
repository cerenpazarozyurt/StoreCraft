import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { QueryProvider } from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoreCraft",
  description: "E-Commerce Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full m-0 p-0 overflow-hidden">
        <Provider>
          <QueryProvider>
          <NuqsAdapter>
          <Box bg="bg.canvas" h="100dvh" w="100vw">
            <div className="flex h-full w-full">
              
              <Sidebar />

              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  {children}
                </main>
              </div>

            </div>
          </Box>
          </NuqsAdapter>
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}