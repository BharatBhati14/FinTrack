import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: {
//     default: "FinTrack — Personal Finance Management",
//     template: "%s | FinTrack",
//   },
//   description:
//     "Track your accounts, transactions, spending, and cash flow with FinTrack.",
// };


export const metadata: Metadata = {
  // metadataBase: new URL("https://your-domain.com"),

  title: {
    default: "FinTrack — Personal Finance Management",
    template: "%s | FinTrack",
  },

  description:
    "Track your accounts, transactions, spending, and cash flow with FinTrack.",

  applicationName: "FinTrack",

  keywords: [
    "personal finance",
    "expense tracker",
    "budget tracker",
    "finance management",
    "money management",
    "transaction tracker",
  ],

  openGraph: {
    type: "website",
    siteName: "FinTrack",
    title: "FinTrack — Personal Finance Management",
    description:
      "Track your accounts, transactions, spending, and cash flow with FinTrack.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinTrack — Personal Finance Management",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FinTrack — Personal Finance Management",
    description:
      "Track your accounts, transactions, spending, and cash flow with FinTrack.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
