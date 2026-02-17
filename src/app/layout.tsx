import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oman Expat - Your Trusted Community for Expatriates in Oman",
  description: "The #1 expat community platform in Oman. Connect with fellow expatriates, find jobs, housing, classifieds, and essential information for living in the Sultanate of Oman.",
  keywords: ["Oman", "expat", "expatriate", "community", "forum", "jobs", "housing", "classifieds", "visa", "Muscat"],
  authors: [{ name: "Oman Expat Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Oman Expat - Expatriate Community Portal",
    description: "Your trusted community for expatriates living in or relocating to Oman",
    url: "https://omanexpat.com",
    siteName: "Oman Expat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oman Expat",
    description: "Your trusted community for expatriates in Oman",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <LanguageProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
