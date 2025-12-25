"use client";

import NextAuthProvider from "@/providers/NextAuthProvider";
import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sherehe Tickets Kenya",
    url: "https://www.sherehe.co.ke",
    description:
      "Discover and book tickets for the most exciting events in Kenya with Sherehe.",
    publisher: {
      "@type": "Organization",
      name: "Sherehe Tickets Kenya",
      logo: {
        "@type": "ImageObject",
        url: "https://www.sherehe.co.ke/favicon.ico",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.sherehe.co.ke/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <title>
          Sherehe Tickets Kenya | Discover & Book Exciting Events in Kenya
        </title>
        <meta
          name="description"
          content="Explore and book tickets for top events in Kenya with Sherehe. Find concerts, festivals, and more in your area."
        />
        <meta
          name="keywords"
          content="events, Kenya, book tickets, concerts, festivals, Sherehe, Nairobi"
        />
        <meta name="author" content="Sherehe" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.sherehe.co.ke" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="Sherehe - Discover & Book Exciting Events in Kenya"
        />
        <meta
          property="og:description"
          content="Find and book tickets for concerts, festivals, and more in Kenya with Sherehe."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sherehe.co.ke" />
        <meta
          property="og:image"
          content="https://www.sherehe.co.ke/og-image.jpg"
        />
        <meta property="og:site_name" content="Sherehe" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sherehe - Discover & Book Exciting Events in Kenya"
        />
        <meta
          name="twitter:description"
          content="Find and book tickets for concerts, festivals, and more in Kenya with Sherehe."
        />
        <meta
          name="twitter:image"
          content="https://www.sherehe.co.ke/og-image.jpg"
        />
        <meta name="twitter:site" content="@ShereheKE" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>
      <body>
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
