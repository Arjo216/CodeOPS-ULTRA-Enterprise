import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Code-OPS ULTRA | Enterprise AI Agent",
  description: "Autonomous Engineering Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-ultra-bg text-foreground flex h-screen overflow-hidden`}>
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Background Grid Effect */}
          <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-20"></div>
          
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 z-10 relative scroll-smooth">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}