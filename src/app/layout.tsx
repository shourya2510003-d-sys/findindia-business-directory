import "./globals-old.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "FindIndia Business Directory",
    template: "%s | FindIndia",
  },

  description:
    "Find verified businesses, shops, services, hospitals, restaurants and local companies across India.",

  keywords: [
    "business directory",
    "local businesses",
    "India business listing",
    "shops near me",
    "restaurants",
    "services",
    "FindIndia",
  ],

  applicationName: "FindIndia",

  metadataBase: new URL("https://findindia.in"),

  openGraph: {
    title: "FindIndia Business Directory",
    description:
      "Find verified businesses and services across India.",
    type: "website",
    siteName: "FindIndia",
  },

  twitter: {
    card: "summary_large_image",
    title: "FindIndia Business Directory",
    description:
      "Find verified businesses and services across India.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b0764",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {children}
      </body>
    </html>
  );
}