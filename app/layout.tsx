import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/layout/Footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: {
    default: "Hub for JavaScript, Web Dev & Tech Trends",
    template: "%s - Jspeeps.Dev",
  },
  description:
    "JSpeeps.dev provides practical coding tips, JavaScript tricks, and dev tutorials to level up your frontend and backend skills.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.className} antialiased`}>
        <div>
          <NextTopLoader
            color="#4F46E5"
            showSpinner={false}
            height={3}
            shadow="0 0 10px rgba(79, 70, 229, 0.5)"
          />
        </div>
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
