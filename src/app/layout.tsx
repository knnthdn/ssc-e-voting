import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const APP_NAME = "SSC E-Voting System";
const APP_DESCRIPTION =
  "Secure campus election platform for managing elections, candidates, and voter ballots.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "e-voting",
    "student election",
    "campus election",
    "ssc",
    "voting system",
  ],
  authors: [{ name: "Our Lady of Assumption College" }],
  creator: "Our Lady of Assumption College",
  publisher: "Our Lady of Assumption College",
  icons: {
    icon: [{ url: "/olac-logo.png" }],
    apple: [{ url: "/olac-logo-no-bg.png" }],
    shortcut: ["/olac-logo.png"],
  },
  openGraph: {
    type: "website",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/olac-hero.png",
        width: 1200,
        height: 630,
        alt: "SSC E-Voting System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/olac-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
