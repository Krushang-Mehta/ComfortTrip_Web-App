import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Comfort Trip — Best Car Rentals & Taxi Service in Rajkot",
    template: "%s | Comfort Trip Car Rentals Rajkot",
  },
  description:
    "Comfort Trip is Rajkot's leading car rental and taxi booking service. Book affordable outstation cabs, airport transfers, luxury chauffeur rentals, and local taxi services across Rajkot, Somnath, Dwarka, Jamnagar, and Gujarat.",
  keywords: [
    "Comfort Trip",
    "Car Rental Rajkot",
    "Best Car Rentals in Rajkot",
    "Taxi Service in Rajkot",
    "Car Tentals Rajkot",
    "Car Bookings Rajkot",
    "The Comfort trip",
    "Affordable car Rentals in Rajkot",
    "Rajkot Airport Taxi",
    "Somnath Dwarka Tour Cabs",
    "Outstation Cabs Rajkot",
    "Cab Booking Gujarat",
    "Tempo Traveller Rajkot",
    "Hirasar Airport Cab Service",
  ],
  authors: [{ name: "Comfort Trip Car Rentals", url: siteUrl }],
  creator: "Comfort Trip Car Rentals",
  publisher: "Comfort Trip Car Rentals",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Comfort Trip — Best Car Rentals & Taxi Service in Rajkot",
    description:
      "Comfort Trip offers the most dependable and affordable car rentals, outstation cabs, and taxi services in Rajkot, Gujarat. Transparent rates, clean vehicles, and 24x7 support.",
    url: siteUrl,
    siteName: "Comfort Trip Car Rentals",
    images: [
      {
        url: "/Car-Banner-3-1.png",
        width: 1200,
        height: 630,
        alt: "Comfort Trip Car Rentals Rajkot Fleet",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comfort Trip — Best Car Rentals & Taxi Service in Rajkot",
    description:
      "Book affordable car rentals and taxi services in Rajkot. Outstation, airport transfers, and local hourly cabs.",
    images: ["/Car-Banner-3-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-purple-100 selection:text-purple-900`}
      >
        <AuthProvider>
          <JsonLd />
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
