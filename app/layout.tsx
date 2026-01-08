import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import localFont from "next/font/local";
import "./globals.scss";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const ppmori = localFont({
  src: '../fonts/PPMori-Regular.woff',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "NSE Policy Generator",
  description: "Generate NSE policies for your school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreFranklin.className} ${ppmori.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
