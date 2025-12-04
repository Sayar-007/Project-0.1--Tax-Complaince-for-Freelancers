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
          <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-center text-sm mt-auto">
              <p className="max-w-4xl mx-auto">
                <strong>Disclaimer:</strong> This tool provides information for educational purposes only and does not constitute legal or financial advice. 
                The generated plans are based on AI analysis of generic tax rules and may not cover your specific situation. 
                Please consult a qualified Chartered Accountant (CA) before making any tax-related decisions.
              </p>
              <p className="mt-2 text-xs text-slate-600">© {new Date().getFullYear()} ComplianceAlpha. All rights reserved.</p>
            </footer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
