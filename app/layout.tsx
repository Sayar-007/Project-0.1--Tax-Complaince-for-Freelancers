import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assuming this file exists or will be created by standard setup
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComplianceAlpha - Indian Freelancer Tax Compliance",
  description: "AI-powered tax compliance roadmap for Indian freelancers and SMBs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Error Boundary could be here, keeping it simple for now */}
          <main className="min-h-screen bg-gray-50">
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
